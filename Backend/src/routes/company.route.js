import express from "express";
import { createCompany, getMyCompany } from "../controllers/company.controller.js";
import { isAllowed, isLoggedIn } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/create",isLoggedIn,isAllowed(["admin"]), createCompany);
router.get("/my-company",isLoggedIn, getMyCompany);

export default router;