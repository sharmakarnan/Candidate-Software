import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js"
import questionRoutes from "./routes/questionRoutes.js"
import db from "./config/db.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 Office Management Server is running successfully!");
});

// ✅ Route registrations
app.use("/api/admin", adminRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/questions", questionRoutes);



// ✅ Database Connection Verification
(async () => {
  try {
    const [rows] = await db.query("SELECT NOW() AS time");
    console.log("✅ Connected to MySQL — Current Time:", rows[0].time);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
