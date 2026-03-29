import express from "express"
import { assignManager, createUser, getCompanyUsers, signin, signupAdmin, updateUserRole } from "../controllers/user.controller.js";
import { isAllowed, isLoggedIn } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/signup", signupAdmin);
router.post("/signin", signin);
router.post("/create",isLoggedIn,isAllowed(["ADMIN"]), createUser);
router.get("/get",isLoggedIn,isAllowed(["ADMIN"]), getCompanyUsers);
router.put("/role/:id",isLoggedIn,isAllowed(["ADMIN"]), updateUserRole);
router.put("/manager/:id", isLoggedIn,isAllowed(["ADMIN"]), assignManager);

export default router;