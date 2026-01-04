import Employee from "../models/Employee.js";


// GET Employee card by employeeId
export const getEmployeeCard = async (req, res) => {
  try {
    const emp = await Employee.findOne(
      { employeeId: req.params.id },
      { name: 1, photo: 1, barcode: 1, employeeId: 1, role: 1 }
    );

    if (!emp) return res.status(404).json({ message: "Invalid Employee ID" });

    res.json({
      employeeId: emp.employeeId,
      name: emp.name,
      role: emp.role,
      //  Use exact DB paths (no extra /uploads/)
      photo: emp.photo || null,
      barcode: emp.barcode || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
