import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import employeeAuthMiddleware from "../middlewares/employeeAuthMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // ADMIN AUTH

import {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  employeeLogin,
} from "../controllers/employeeController.js";

const router = express.Router();

// EMPLOYEE LOGIN (PUBLIC)
router.post("/login", employeeLogin);

// ================= ADMIN ROUTES =================

// ➕ ADD EMPLOYEE (ADMIN ONLY)
router.post(
  "/",
  authMiddleware,               // ADMIN
  upload.single("photo"),
  addEmployee
);

// GET ALL EMPLOYEES (ADMIN)
router.get("/", authMiddleware, getAllEmployees);

// GET SINGLE EMPLOYEE (ADMIN)
router.get("/:id", authMiddleware, getEmployeeById);

// UPDATE EMPLOYEE (ADMIN)
router.put("/:id", authMiddleware, upload.single("photo"), updateEmployee);

// DELETE EMPLOYEE (ADMIN)
router.delete("/:id", authMiddleware, deleteEmployee);

// ================= EMPLOYEE ROUTES =================

// EMPLOYEE PROFILE (example)
router.get("/profile/me", employeeAuthMiddleware, (req, res) => {
  res.json(req.employee);
});

export default router;
