import express from "express";
import {
  markAttendance,
  getAttendance,
  getTodayAttendance,
  getAttendanceReport
} from "../controllers/attendanceController.js";

const router = express.Router();

// Employee
router.post("/", markAttendance);
router.get("/today/:employeeId", getTodayAttendance);

// Admin
router.get("/", getAttendance);
router.get("/report", getAttendanceReport);

export default router;
