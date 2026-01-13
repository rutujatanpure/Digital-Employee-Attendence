import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import SavedAttendance from "../models/SavedAttendance.js";

/*
  EMPLOYEE – MARK ATTENDANCE (IN / OUT)
 */
export const markAttendance = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Check employee exists
    const emp = await Employee.findOne({ employeeId });
    if (!emp) {
      return res.status(404).json({ message: "❌ Invalid Employee ID" });
    }

    // Today range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Find today's attendance
    let attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // FIRST SCAN → IN
    if (!attendance) {
      attendance = await Attendance.create({
        employeeId,
        date: new Date(),
        inTime: new Date(),
      });

      return res.json({
        message: "✅ Attendance IN marked",
        type: "IN",
        attendance,
      });
    }

    // SECOND SCAN → OUT
    if (!attendance.outTime) {
      attendance.outTime = new Date();
      await attendance.save();

      return res.json({
        message: "✅ Attendance OUT marked",
        type: "OUT",
        attendance,
      });
    }

    // Already done
    return res.status(400).json({
      message: "⚠️ Attendance already completed for today",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN – GET ALL ATTENDANCE
 */
export const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * EMPLOYEE – GET TODAY ATTENDANCE
 */
export const getTodayAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    res.json(attendance || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 *  ADMIN – MONTHLY ATTENDANCE GRID REPORT
 * (Present / Absent auto calculated)
 */
export const getAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const daysInMonth = new Date(year, month, 0).getDate();

    // All employees
    const employees = await Employee.find();

    // Monthly attendance records
    const attendances = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const report = employees.map(emp => {
      const attendanceMap = {};

      // Default Absent ❌
      for (let d = 1; d <= daysInMonth; d++) {
        attendanceMap[d] = "A";
      }

      // Mark Present ✔
      attendances
        .filter(a => a.employeeId === emp.employeeId)
        .forEach(a => {
          const day = new Date(a.date).getDate();
          if (a.inTime) {
            attendanceMap[day] = "P";
          }
        });

      return {
        employeeId: emp.employeeId,
        name: emp.name,
        designation: emp.designation,
        photo: emp.photo,
        attendance: attendanceMap,
      };
    });

    res.json({
      month,
      year,
      daysInMonth,
      totalEmployees: employees.length,
      report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
