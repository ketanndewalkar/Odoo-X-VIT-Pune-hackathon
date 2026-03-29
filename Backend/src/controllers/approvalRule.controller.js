import ApprovalRule from "../models/approvalRule.model.js";
import ApprovalFlow from "../models/approvalFlow.model.js";

const allowedLogic = ["PERCENTAGE", "SPECIFIC", "HYBRID_OR", "HYBRID_AND"];
const allowedRoles = ["ADMIN", "MANAGER", "FINANCE", "DIRECTOR", "CFO"];

const validateRulePayload = ({ percentageThreshold, specificApproverRole, logic }) => {
  if (!allowedLogic.includes(logic)) {
    throw new Error("Invalid rule logic");
  }

  if (
    ["PERCENTAGE", "HYBRID_OR", "HYBRID_AND"].includes(logic) &&
    (percentageThreshold === null ||
      percentageThreshold === undefined ||
      percentageThreshold < 1 ||
      percentageThreshold > 100)
  ) {
    throw new Error("Valid percentageThreshold is required");
  }

  if (
    ["SPECIFIC", "HYBRID_OR", "HYBRID_AND"].includes(logic) &&
    (!specificApproverRole || !allowedRoles.includes(specificApproverRole))
  ) {
    throw new Error("Valid specificApproverRole is required");
  }
};

export const createApprovalRule = async (req, res) => {
  try {
    const {
      flowId,
      percentageThreshold = null,
      specificApproverRole = null,
      logic,
    } = req.body;

    if (!flowId || !logic) {
      return res.status(400).json({
        success: false,
        message: "flowId and logic are required",
      });
    }

    const flow = await ApprovalFlow.findOne({
      _id: flowId,
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!flow) {
      return res.status(404).json({
        success: false,
        message: "Approval flow not found",
      });
    }

    const existingRule = await ApprovalRule.findOne({
      flowId,
      companyId: req.user.companyId,
      isActive: true,
    });

    if (existingRule) {
      return res.status(409).json({
        success: false,
        message: "Approval rule already exists for this flow",
      });
    }

    validateRulePayload({ percentageThreshold, specificApproverRole, logic });

    const rule = await ApprovalRule.create({
      companyId: req.user.companyId,
      flowId,
      percentageThreshold,
      specificApproverRole,
      logic,
    });

    return res.status(201).json({
      success: true,
      message: "Approval rule created successfully",
      rule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while creating approval rule",
    });
  }
};

export const getApprovalRuleByFlowId = async (req, res) => {
  try {
    const rule = await ApprovalRule.findOne({
      flowId: req.params.flowId,
      companyId: req.user.companyId,
      isActive: true,
    }).populate("flowId");

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Approval rule not found",
      });
    }

    return res.status(200).json({
      success: true,
      rule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while fetching approval rule",
    });
  }
};

export const updateApprovalRule = async (req, res) => {
  try {
    const {
      percentageThreshold = null,
      specificApproverRole = null,
      logic,
    } = req.body;

    const rule = await ApprovalRule.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
      isActive: true,
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Approval rule not found",
      });
    }

    if (!logic) {
      return res.status(400).json({
        success: false,
        message: "logic is required",
      });
    }

    validateRulePayload({ percentageThreshold, specificApproverRole, logic });

    rule.percentageThreshold = percentageThreshold;
    rule.specificApproverRole = specificApproverRole;
    rule.logic = logic;

    await rule.save();

    return res.status(200).json({
      success: true,
      message: "Approval rule updated successfully",
      rule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while updating approval rule",
    });
  }
};