import mongoose from "mongoose";

const expenseApprovalSchema = new mongoose.Schema(
  {
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
      required: true,
    },

    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approverRole: {
      type: String,
      enum: ["ADMIN", "MANAGER", "EMPLOYEE", "FINANCE", "DIRECTOR", "CFO"],
      required: true,
    },

    stepNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["WAITING", "PENDING", "APPROVED", "REJECTED", "SKIPPED"],
      default: "WAITING",
    },

    comment: {
      type: String,
      default: "",
      trim: true,
    },

    actionAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


expenseApprovalSchema.index(
  { expenseId: 1, stepNumber: 1, approverId: 1 },
  { unique: true }
);

const ExpenseApproval = mongoose.model("ExpenseApproval", expenseApprovalSchema);

export default ExpenseApproval;