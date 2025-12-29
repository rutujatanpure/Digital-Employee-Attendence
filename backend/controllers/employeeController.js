import Employee from "../models/Employee.js";
import generateEmployeeId from "../utils/generateEmployeeId.js";
import generateBarcode from "../utils/generateBarcode.js";
import fs from "fs";
import path from "path";

// ➕ ADD EMPLOYEE
export const addEmployee = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();

    // 🔥 barcode generate + save
    const barcodePath = await generateBarcode(employeeId); // e.g., uploads/employees/EMP0002.png

    const employee = new Employee({
      employeeId,
      name: req.body.name,
      photo: req.file ? `uploads/employees/${req.file.filename}` : null, // full path
      dob: req.body.dob,
      mobile: req.body.mobile,
      email: req.body.email,
      role: req.body.role,
      barcode: barcodePath, // already full path
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 GET ALL EMPLOYEES
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 GET SINGLE EMPLOYEE
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

    // Update photo if new file uploaded
    if (req.file) {
      // Delete old photo if exists
      if (emp.photo && fs.existsSync(path.join(process.cwd(), emp.photo))) {
        fs.unlinkSync(path.join(process.cwd(), emp.photo));
      }
      emp.photo = `uploads/employees/${req.file.filename}`;
    }

    // Update other fields
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

// ❌ DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({ employeeId: req.params.id });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    // Delete photo if exists
    if (emp.photo && fs.existsSync(path.join(process.cwd(), emp.photo))) {
      fs.unlinkSync(path.join(process.cwd(), emp.photo));
    }

    // Delete barcode if exists
    if (emp.barcode && fs.existsSync(path.join(process.cwd(), emp.barcode))) {
      fs.unlinkSync(path.join(process.cwd(), emp.barcode));
    }

    await emp.deleteOne();
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
