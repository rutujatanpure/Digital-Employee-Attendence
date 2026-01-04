import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import SavedAttendance from "../models/SavedAttendance.js";



export const markAttendance = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // 1️⃣ Check employee exists
    const emp = await Employee.findOne({ employeeId });
    if (!emp) {
      return res.status(404).json({ message: "❌ Invalid Employee ID" });
    }

    // 2️⃣ Today date range (IMPORTANT: use Date, not string)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 3️⃣ Find today's attendance
    let attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    // 4️⃣ FIRST SCAN → IN TIME
    if (!attendance) {
      attendance = await Attendance.create({
        employeeId,
        date: new Date(),
        inTime: new Date(),
      });

      return res.json({
        message: "✅ Attendance IN marked successfully",
        type: "IN",
        attendance, 
      });
    }

    // 5️⃣ SECOND SCAN → OUT TIME
    if (!attendance.outTime) {
      attendance.outTime = new Date();
      await attendance.save();

      return res.json({
        message: "✅ Attendance OUT marked successfully",
        type: "OUT",
        attendance, 
      });
    }

    // 6️⃣ Already IN + OUT done
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
 * EMPLOYEE – GET TODAY ATTENDANCE (for dashboard display)
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

// MONTHLY ATTENDANCE REPORT (ADMIN)
export const getAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const report = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
