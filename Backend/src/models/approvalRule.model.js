import mongoose from "mongoose";

const approvalRuleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    flowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApprovalFlow",
      required: true,
    },

    percentageThreshold: {
      type: Number,
      default: null,
      min: 1,
      max: 100,
    },

    specificApproverRole: {
      type: String,
      enum: ["ADMIN", "MANAGER", "FINANCE", "DIRECTOR", "CFO", null],
      default: null,
    },

    logic: {
      type: String,
      enum: ["PERCENTAGE", "SPECIFIC", "HYBRID_OR", "HYBRID_AND"],
      default: "PERCENTAGE",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ApprovalRule = mongoose.model("ApprovalRule", approvalRuleSchema);

export default ApprovalRule;