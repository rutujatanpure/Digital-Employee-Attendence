import Counter from "../models/Counter.js";

const generateEmployeeId = async () => {
  // Increment sequence atomically or create new counter
  const counter = await Counter.findOneAndUpdate(
    { name: "employeeId" },
    { $inc: { seq: 1 } },           // increment by 1
    { new: true, upsert: true }     // create if not exists
  );

  const seqNumber = counter.seq.toString().padStart(4, "0");
  return `EMP${seqNumber}`;
};

export default generateEmployeeId;
