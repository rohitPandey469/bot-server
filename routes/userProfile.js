import express from "express";
import { getAllUsers,updateProfile } from "../controllers/userProfile.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/getAllUsers",  getAllUsers);
router.patch("/update/:id", 
auth, 
updateProfile);

export default router;
