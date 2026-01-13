import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";

// ----------------------
// Load single root .env
// ----------------------
// This ensures .env from root folder is used, whether cwd is backend or root
dotenv.config({ path: path.resolve(path.join(process.cwd(), ".."), ".env") });

connectDB();

const app = express();

// ----------------------
// CORS
// ----------------------
app.use(
  cors({
    origin: true, // allows any origin (works for dev + prod)
    credentials: true,
  })
);

app.use(express.json());

// ----------------------
// STATIC FILES (uploads)
// ----------------------
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// ----------------------
// API Routes
// ----------------------
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeePublicRoutes from "./routes/employeePublicRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/public/employees", employeePublicRoutes);
app.use("/api/attendance", attendanceRoutes);

// ----------------------
// FRONTEND PRODUCTION BUILD SERVE
// ----------------------
const frontendBuildPath = path.join(process.cwd(), "../frontend/build");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
