import express from "express";
import { createApprovalRule, getApprovalRuleByFlowId, updateApprovalRule } from "../controllers/approvalRule.controller.js";
import { isAllowed, isLoggedIn } from "../middlewares/user.middleware.js";


const router = express.Router();

router.use(isLoggedIn,isAllowed(["ADMIN"]));

router.post("/", createApprovalRule);
router.get("/:flowId", getApprovalRuleByFlowId);
router.put("/:id", updateApprovalRule);

export default router;