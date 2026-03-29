import express from "express";

import { isAllowed, isLoggedIn } from "../middlewares/user.middleware.js";
import { createApprovalFlow, deactivateApprovalFlow, getApprovalFlowById, getApprovalFlows, updateApprovalFlow } from "../controllers/approvalFlow.controller.js";

const router = express.Router();

router.use(isLoggedIn, isAllowed(["ADMIN"]));

router.post("/", createApprovalFlow);
router.get("/", getApprovalFlows);
router.get("/:id", getApprovalFlowById);
router.put("/:id", updateApprovalFlow);
router.patch("/:id/deactivate", deactivateApprovalFlow);

export default router;