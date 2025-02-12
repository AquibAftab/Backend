import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

// Route for user registration
router.route("/register").post(registerUser);

export default router;
