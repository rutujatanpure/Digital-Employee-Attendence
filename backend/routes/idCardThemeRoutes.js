import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getThemes,
  getActiveTheme,
  applyTheme,
} from "../controllers/idCardThemeController.js";

const router = express.Router();

// Admin
router.get("/", authMiddleware, getThemes);
router.post("/apply", authMiddleware, applyTheme);

// Employee (public)
router.get("/active", getActiveTheme);

export default router;
