import express from "express";
const router = express.Router();
import { userRegister, userSendOtp, userLogin } from "../controllers/user.js";

// Routes
router.post("/user/register", userRegister);
router.post("/user/sendOtp", userSendOtp);
router.post("/user/login", userLogin);

export default router;
