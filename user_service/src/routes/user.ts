import express from "express";
import { getProfile, updateProfile, getAllUsers } from "../controllers/user";
import { verifyToken, isAdmin } from "../middlewares/auth";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get("/", verifyToken, isAdmin, getAllUsers); // Admin only

export default router;
