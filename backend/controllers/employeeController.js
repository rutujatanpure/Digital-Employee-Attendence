import Employee from "../models/Employee.js";
import generateEmployeeId from "../utils/generateEmployeeId.js";
import generateBarcode from "../utils/generateBarcode.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ➕ ADD EMPLOYEE
export const addEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();

    // barcode generate + save
    const barcodePath = await generateBarcode(employeeId); // e.g., uploads/employees/EMP0002.png

    const employee = new Employee({
      employeeId,
      name: req.body.name,
      password: req.body.password, 
      photo: req.file ? `uploads/employees/${req.file.filename}` : null, 
      dob: req.body.dob,
      mobile: req.body.mobile,
      email: req.body.email,
      role: req.body.role,
      barcode: barcodePath, 
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL EMPLOYEES
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE EMPLOYEE
export const getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findOne({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUBLIC GET (FOR EMPLOYEE ID CARD)
export const getEmployeeByPublicId = async (req, res) => {
  try {
    const emp = await Employee.findOne({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    if (req.file) {
      if (emp.photo && fs.existsSync(path.join(process.cwd(), emp.photo))) {
        fs.unlinkSync(path.join(process.cwd(), emp.photo));
      }
      emp.photo = `uploads/employees/${req.file.filename}`;
    }

    emp.name = req.body.name || emp.name;
    emp.dob = req.body.dob || emp.dob;
    emp.mobile = req.body.mobile || emp.mobile;
    emp.email = req.body.email || emp.email;
    emp.role = req.body.role || emp.role;

    await emp.save();
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    if (emp.photo && fs.existsSync(path.join(process.cwd(), emp.photo))) {
      fs.unlinkSync(path.join(process.cwd(), emp.photo));
    }

    if (emp.barcode && fs.existsSync(path.join(process.cwd(), emp.barcode))) {
      fs.unlinkSync(path.join(process.cwd(), emp.barcode));
    }

    await emp.deleteOne();
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// EMPLOYEE LOGIN
export const employeeLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: employee._id, role: "employee" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      employeeId: employee.employeeId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
