import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },  // counter name, example "employeeId"
  seq: { type: Number, default: 0 },       // current sequence number
});

export default mongoose.model("Counter", counterSchema);
