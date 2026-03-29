import express from "express";
import {
  submitExpense,
  getMyExpenses,
  getExpenseById,
  getPendingApprovals,
  approveExpense,
  rejectExpense,
} from "../controllers/expense.controller.js";
import { isLoggedIn } from "../middlewares/user.middleware.js";


const router = express.Router();

router.use(isLoggedIn);

router.post("/", submitExpense);
router.get("/my", getMyExpenses);
router.get("/pending-approvals", getPendingApprovals);
router.get("/:id", getExpenseById);
router.patch("/approve/:approvalId", approveExpense);
router.patch("/reject/:approvalId", rejectExpense);

export default router;