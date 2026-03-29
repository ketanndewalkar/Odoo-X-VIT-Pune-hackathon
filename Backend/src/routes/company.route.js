import express from "express";
import { createCompany, getMyCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.post("/create", createCompany);
router.get("/my-company", getMyCompany);

export default router;