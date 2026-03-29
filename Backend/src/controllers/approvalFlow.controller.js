import ApprovalFlow from "../models/approvalFlow.model.js";
import User from "../models/user.model.js";

const validateSteps = async (companyId, steps) => {
  if (!Array.isArray(steps)) {
    throw new Error("Steps must be an array");
  }

  const stepNumbers = steps.map((step) => step.stepNumber);

  if (stepNumbers.length !== new Set(stepNumbers).size) {
    throw new Error("Duplicate step numbers are not allowed");
  }

  for (const step of steps) {
    if (!["ROLE", "USER"].includes(step.approverType)) {
      throw new Error("Invalid approver type");
    }

    if (step.approverType === "ROLE" && !step.role) {
      throw new Error("Role is required when approverType is ROLE");
    }

    if (step.approverType === "USER") {
      if (!step.userId) {
        throw new Error("User is required when approverType is USER");
      }

      const user = await User.findOne({
        _id: step.userId,
        companyId,
        isActive: true,
      });

      if (!user) {
        throw new Error("Invalid user in approval steps");
      }
    }
  }
};

export const createApprovalFlow = async (req, res) => {
  try {
    const { name, description, isManagerApproved, steps = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Flow name is required",
      });
    }

    if (!isManagerApproved && (!Array.isArray(steps) || steps.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one step is required if manager approval is disabled",
      });
    }

    await validateSteps(req.user.companyId, steps);

    const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

    const flow = await ApprovalFlow.create({
      companyId: req.user.companyId,
      name: name.trim(),
      description: description?.trim() || "",
      isManagerApproved: !!isManagerApproved,
      steps: sortedSteps,
    });

    return res.status(201).json({
      success: true,
      message: "Approval flow created successfully",
      flow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while creating approval flow",
    });
  }
};

export const getApprovalFlows = async (req, res) => {
  try {
    const flows = await ApprovalFlow.find({
      companyId: req.user.companyId,
      isActive: true,
    })
      .populate("steps.userId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: flows.length,
      flows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while fetching approval flows",
    });
  }
};

export const getApprovalFlowById = async (req, res) => {
  try {
    const flow = await ApprovalFlow.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    }).populate("steps.userId", "name email role");

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "Approval flow not found",
      });
    }

    return res.status(200).json({
      success: true,
      flow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while fetching approval flow",
    });
  }
};

export const updateApprovalFlow = async (req, res) => {
  try {
    const { name, description, isManagerApproved, steps = [] } = req.body;

    const flow = await ApprovalFlow.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "Approval flow not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Flow name is required",
      });
    }

    if (!isManagerApproved && (!Array.isArray(steps) || steps.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "At least one step is required if manager approval is disabled",
      });
    }

    await validateSteps(req.user.companyId, steps);

    flow.name = name.trim();
    flow.description = description?.trim() || "";
    flow.isManagerApproved = !!isManagerApproved;
    flow.steps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

    await flow.save();

    return res.status(200).json({
      success: true,
      message: "Approval flow updated successfully",
      flow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while updating approval flow",
    });
  }
};

export const deactivateApprovalFlow = async (req, res) => {
  try {
    const flow = await ApprovalFlow.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "Approval flow not found",
      });
    }

    flow.isActive = false;
    await flow.save();

    return res.status(200).json({
      success: true,
      message: "Approval flow deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while deactivating approval flow",
    });
  }
};