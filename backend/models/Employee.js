import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: String,
    dob: String,
    mobile: String,
    email: String,
    role: String,
    barcode: String,

    // PASSWORD (HASHED)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);



// ================= HASH PASSWORD BEFORE SAVE =================
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



// ================= COMPARE PASSWORD METHOD =================
employeeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Employee", employeeSchema);
