import express from "express";
import { getEmployeeCard } from "../controllers/employeePublicController.js";

const router = express.Router();

// GET Employee card by employeeId
router.get("/:id", getEmployeeCard);

export default router;
