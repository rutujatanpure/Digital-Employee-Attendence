import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  photo: String,
  dob: String,
  mobile: String,
  email: String,
  role: String,
  barcode: String,
});

export default mongoose.model("Employee", employeeSchema);
