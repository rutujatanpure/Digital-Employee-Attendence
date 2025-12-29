import express from "express";
import {
  markAttendance,
  getAttendance,
  getTodayAttendance,
  getAttendanceReport
} from "../controllers/attendanceController.js";
import SavedAttendance from "../models/SavedAttendance.js";


const router = express.Router();

router.post("/", markAttendance);                 // IN / OUT
router.get("/", getAttendance);                   // Admin
router.get("/today/:employeeId", getTodayAttendance); // Employee dashboard
router.get("/report", getAttendanceReport);


export default router;
