import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvalFlowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApprovalFlow",
      required: true,
    },

    amountOriginal: {
      type: Number,
      required: true,
      min: 0,
    },

    currencyOriginal: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    amountInCompanyCurrency: {
      type: Number,
      required: true,
      min: 0,
    },

    companyCurrency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    receiptUrl: {
      type: String,
      default: "",
    },

    ocrRawText: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_APPROVAL", "APPROVED", "REJECTED", "OVERRIDDEN"],
      default: "IN_APPROVAL",
    },

    currentApprovalStep: {
      type: Number,
      default: 1,
    },

    finalApprovedAt: {
      type: Date,
      default: null,
    },

    finalRejectedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;