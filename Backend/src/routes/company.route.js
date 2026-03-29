import express from "express";
import { createCompany, getAllUsers, getMyCompany } from "../controllers/company.controller.js";
import { isAllowed, isLoggedIn } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/create",isLoggedIn,isAllowed(["ADMIN"]), createCompany);
router.get("/my-company",isLoggedIn, getMyCompany);
router.get("/users",isLoggedIn, isAllowed(["ADMIN"]), getAllUsers);

export default router;