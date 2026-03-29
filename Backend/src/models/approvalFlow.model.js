import mongoose from "mongoose";

const approvalStepSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: Number,
      required: true,
    },

    approverType: {
      type: String,
      enum: [ "ROLE", "USER"],
      required: true,
    },

   
    role: {
      type: String,
      enum: [ "FINANCE", "DIRECTOR", "CFO", "ADMIN", null],
      default: null,
    },

  
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: false }
);

const approvalFlowSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    isManagerApproved:{
        type:Boolean,
    },

    steps: {
      type: [approvalStepSchema],
      validate: {
        validator: function (steps) {
            if(isManagerApproved) return true;
            return steps && steps.length > 0;
        },
        message: "Approval flow must have at least one step",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ApprovalFlow = mongoose.model("ApprovalFlow", approvalFlowSchema);

export default ApprovalFlow;