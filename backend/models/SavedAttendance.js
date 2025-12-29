import mongoose from "mongoose";

const savedAttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  inTime: Date,
  outTime: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SavedAttendance", savedAttendanceSchema);
