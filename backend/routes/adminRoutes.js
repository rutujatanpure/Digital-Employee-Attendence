import express from "express";
import { adminLogin, getAdminProfile } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/me", authMiddleware, getAdminProfile);

export default router;
