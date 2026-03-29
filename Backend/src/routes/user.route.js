import express from "express"
import { signin, signupAdmin } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/signin", signin);

export default router;