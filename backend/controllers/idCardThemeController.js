import IdCardTheme from "../models/IdCardTheme.js";

// Admin – get all themes
export const getThemes = async (req, res) => {
  const themes = await IdCardTheme.find().sort({ createdAt: 1 });
  res.json(themes);
};

// Employee – get active theme
export const getActiveTheme = async (req, res) => {
  const theme = await IdCardTheme.findOne({ isActive: true });
  res.json(theme);
};

// Admin – apply theme (FIXED)
export const applyTheme = async (req, res) => {
  const { themeKey } = req.body;

  if (!themeKey) {
    return res.status(400).json({ message: "themeKey is required" });
  }

  // 1️⃣ Sab themes inactive
  await IdCardTheme.updateMany({}, { isActive: false });

  // 2️⃣ Theme apply (agar DB me nahi hai to create bhi ho jayegi)
  const theme = await IdCardTheme.findOneAndUpdate(
    { themeKey },
    { isActive: true },
    { new: true, upsert: true }
  );

  res.json({
    message: "Theme applied successfully",
    theme,
  });
};
