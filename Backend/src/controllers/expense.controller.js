import Expense from "../models/expense.model.js";
import ExpenseApproval from "../models/expenseApproval.model.js";
import ApprovalFlow from "../models/approvalFlow.model.js";
import ApprovalRule from "../models/approvalRule.model.js";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

const buildStepApprovers = async (companyId, employee, flow) => {
  const runtimeSteps = [];
  let runtimeStepNumber = 1;

  if (flow.isManagerApprover) {
    if (!employee.managerId) {
      throw new Error("Employee does not have a manager assigned");
    }

    const manager = await User.findOne({
      _id: employee.managerId,
      companyId,
      isActive: true,
    });

    if (!manager) {
      throw new Error("Assigned manager not found");
    }

    runtimeSteps.push({
      stepNumber: runtimeStepNumber,
      approvers: [
        {
          approverId: manager._id,
          approverRole: manager.role,
        },
      ],
    });

    runtimeStepNumber += 1;
  }

  const sortedSteps = [...flow.steps].sort((a, b) => a.stepNumber - b.stepNumber);

  for (const step of sortedSteps) {
    if (step.approverType === "USER") {
      const user = await User.findOne({
        _id: step.userId,
        companyId,
        isActive: true,
      });

      if (!user) {
        throw new Error(`Invalid user found in flow step ${step.stepNumber}`);
      }

      runtimeSteps.push({
        stepNumber: runtimeStepNumber,
        approvers: [
          {
            approverId: user._id,
            approverRole: user.role,
          },
        ],
      });

      runtimeStepNumber += 1;
    }

    if (step.approverType === "ROLE") {
      const users = await User.find({
        companyId,
        role: step.role,
        isActive: true,
      });

      if (!users.length) {
        throw new Error(`No active users found for role ${step.role}`);
      }

      runtimeSteps.push({
        stepNumber: runtimeStepNumber,
        approvers: users.map((user) => ({
          approverId: user._id,
          approverRole: user.role,
        })),
      });

      runtimeStepNumber += 1;
    }
  }

  if (!runtimeSteps.length) {
    throw new Error("No approvers resolved from approval flow");
  }

  return runtimeSteps;
};

const activateStep = async (expenseId, stepNumber) => {
  await ExpenseApproval.updateMany(
    { expenseId, stepNumber, status: "WAITING" },
    { $set: { status: "PENDING" } }
  );
};

const evaluateStepDecision = async (expense, rule, stepApprovals) => {
  const approvedCount = stepApprovals.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = stepApprovals.filter((a) => a.status === "REJECTED").length;
  const total = stepApprovals.length;

  if (rejectedCount > 0 && (!rule || rule.logic === "PERCENTAGE")) {
    return "REJECT";
  }

  if (!rule) {
    if (approvedCount === total) return "APPROVE_STEP";
    if (rejectedCount > 0) return "REJECT";
    return "WAIT";
  }

  const percentage = total ? (approvedCount / total) * 100 : 0;
  const specificApproved = rule.specificApproverRole
    ? stepApprovals.some(
        (a) => a.approverRole === rule.specificApproverRole && a.status === "APPROVED"
      )
    : false;

  if (rule.logic === "PERCENTAGE") {
    if (rejectedCount > 0) return "REJECT";
    if (percentage >= rule.percentageThreshold) return "APPROVE_STEP";
    return "WAIT";
  }

  if (rule.logic === "SPECIFIC") {
    if (specificApproved) return "APPROVE_STEP";
    if (
      stepApprovals
        .filter((a) => a.approverRole === rule.specificApproverRole)
        .some((a) => a.status === "REJECTED")
    ) {
      return "REJECT";
    }
    return "WAIT";
  }

  if (rule.logic === "HYBRID_OR") {
    if (specificApproved || percentage >= rule.percentageThreshold) {
      return "APPROVE_STEP";
    }

    const specificRejected = stepApprovals
      .filter((a) => a.approverRole === rule.specificApproverRole)
      .some((a) => a.status === "REJECTED");

    if (specificRejected && rejectedCount === total) {
      return "REJECT";
    }

    return "WAIT";
  }

  if (rule.logic === "HYBRID_AND") {
    const specificRejected = stepApprovals
      .filter((a) => a.approverRole === rule.specificApproverRole)
      .some((a) => a.status === "REJECTED");

    if (specificRejected) return "REJECT";

    if (specificApproved && percentage >= rule.percentageThreshold) {
      return "APPROVE_STEP";
    }

    return "WAIT";
  }

  return "WAIT";
};

export const submitExpense = async (req, res) => {
  try {
    const {
      approvalFlowId,
      amountOriginal,
      currencyOriginal,
      amountInCompanyCurrency,
      category,
      description,
      expenseDate,
      receiptUrl,
    } = req.body;

    if (
      !approvalFlowId ||
      amountOriginal === undefined ||
      !currencyOriginal ||
      amountInCompanyCurrency === undefined ||
      !category ||
      !expenseDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const employee = await User.findOne({
      _id: req.user._id,
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const company = await Company.findById(req.user.companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const flow = await ApprovalFlow.findOne({
      _id: approvalFlowId,
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "Approval flow not found",
      });
    }

    const runtimeSteps = await buildStepApprovers(req.user.companyId, employee, flow);

    const expense = await Expense.create({
      companyId: req.user.companyId,
      employeeId: req.user._id,
      approvalFlowId,
      amountOriginal,
      currencyOriginal: currencyOriginal.trim().toUpperCase(),
      amountInCompanyCurrency,
      companyCurrency: company.defaultCurrency,
      category: category.trim(),
      description: description?.trim() || "",
      expenseDate,
      receiptUrl: receiptUrl || "",
      status: "IN_APPROVAL",
      currentApprovalStep: 1,
    });

    const approvalDocs = runtimeSteps.flatMap((step) =>
      step.approvers.map((approver) => ({
        expenseId: expense._id,
        approverId: approver.approverId,
        approverRole: approver.approverRole,
        stepNumber: step.stepNumber,
        status: step.stepNumber === 1 ? "PENDING" : "WAITING",
      }))
    );

    await ExpenseApproval.insertMany(approvalDocs);

    return res.status(201).json({
      success: true,
      message: "Expense submitted successfully",
      expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while submitting expense",
    });
  }
};

export const getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      employeeId: req.user._id,
      companyId: req.user.companyId,
    })
      .populate("approvalFlowId", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while fetching expenses",
    });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    })
      .populate("employeeId", "name email role")
      .populate("approvalFlowId", "name description");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const approvals = await ExpenseApproval.find({
      expenseId: expense._id,
    })
      .populate("approverId", "name email role")
      .sort({ stepNumber: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      expense,
      approvals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while fetching expense",
    });
  }
};

export const getPendingApprovals = async (req, res) => {
  try {
    const pendingApprovals = await ExpenseApproval.find({
      approverId: req.user._id,
      status: "PENDING",
    })
      .populate({
        path: "expenseId",
        populate: [
          { path: "employeeId", select: "name email role" },
          { path: "approvalFlowId", select: "name description" },
        ],
      })
      .sort({ createdAt: -1 });
      console.log("Pending Approvals:", pendingApprovals); // Debug log
      console.log(req.user)

    return res.status(200).json({
      success: true,
      count: pendingApprovals.length,
      pendingApprovals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while fetching pending approvals",
    });
  }
};

export const approveExpense = async (req, res) => {
  try {
    const { comment } = req.body;

    const approval = await ExpenseApproval.findOne({
      _id: req.params.approvalId,
      approverId: req.user._id,
      status: "PENDING",
    });

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Pending approval not found",
      });
    }

    approval.status = "APPROVED";
    approval.comment = comment.trim();
    approval.actionAt = new Date();
    await approval.save();

    const expense = await Expense.findById(approval.expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const stepApprovals = await ExpenseApproval.find({
      expenseId: expense._id,
      stepNumber: approval.stepNumber,
    });

    const rule = await ApprovalRule.findOne({
      flowId: expense.approvalFlowId,
      companyId: expense.companyId,
      isActive: true,
    });

    const decision = await evaluateStepDecision(expense, rule, stepApprovals);

    if (decision === "WAIT") {
      return res.status(200).json({
        success: true,
        message: "Approval recorded. Waiting for other approvers.",
      });
    }

    if (decision === "REJECT") {
      await ExpenseApproval.updateMany(
        {
          expenseId: expense._id,
          status: { $in: ["WAITING", "PENDING"] },
        },
        { $set: { status: "SKIPPED" } }
      );

      expense.status = "REJECTED";
      expense.finalRejectedAt = new Date();
      await expense.save();

      return res.status(200).json({
        success: true,
        message: "Expense rejected",
      });
    }

    const nextStepApprovals = await ExpenseApproval.find({
      expenseId: expense._id,
      stepNumber: approval.stepNumber + 1,
    });

    if (!nextStepApprovals.length) {
      await ExpenseApproval.updateMany(
        {
          expenseId: expense._id,
          status: "WAITING",
        },
        { $set: { status: "SKIPPED" } }
      );

      expense.status = "APPROVED";
      expense.finalApprovedAt = new Date();
      expense.currentApprovalStep = approval.stepNumber;
      await expense.save();

      return res.status(200).json({
        success: true,
        message: "Expense fully approved",
      });
    }

    await activateStep(expense._id, approval.stepNumber + 1);

    expense.currentApprovalStep = approval.stepNumber + 1;
    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Step approved. Next step activated.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while approving expense",
    });
  }
};

export const rejectExpense = async (req, res) => {
  try {
    const { comment = "" } = req.body;

    const approval = await ExpenseApproval.findOne({
      _id: req.params.approvalId,
      approverId: req.user._id,
      status: "PENDING",
    });

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Pending approval not found",
      });
    }

    approval.status = "REJECTED";
    approval.comment = comment.trim();
    approval.actionAt = new Date();
    await approval.save();

    const expense = await Expense.findById(approval.expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await ExpenseApproval.updateMany(
      {
        expenseId: expense._id,
        _id: { $ne: approval._id },
        status: { $in: ["WAITING", "PENDING"] },
      },
      { $set: { status: "SKIPPED" } }
    );

    expense.status = "REJECTED";
    expense.finalRejectedAt = new Date();
    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while rejecting expense",
    });
  }
};