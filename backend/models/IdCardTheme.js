import mongoose from "mongoose";

const idCardThemeSchema = new mongoose.Schema(
  {
    themeKey: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("IdCardTheme", idCardThemeSchema);
