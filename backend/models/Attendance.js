import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  inTime: {
    type: Date,
  },

  outTime: {
    type: Date,
  },
});

export default mongoose.model("Attendance", attendanceSchema);
