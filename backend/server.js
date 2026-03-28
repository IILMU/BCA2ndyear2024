import "dotenv/config";

import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";
import authRouter   from "./routes/auth.js";
import historyRouter from "./routes/history.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────
app.use(cors());           // Allow requests from any origin (frontend, etc.)
app.use(express.json());   // Parse incoming JSON bodies

app.get("/", (req, res) => {
  res.send("API working");
});

// ── Routes ────────────────────────────────────────
app.use((req, res, next) => {
  console.log("👉 Incoming request:", req.method, req.url);
  next();
});
app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/analyze", analyzeRouter);
app.use("/api/auth", authRouter);
app.use("/api/history", historyRouter);

// ── Health Check ──────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ── 404 fallback ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Start server
app.set("trust proxy", true);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Factify backend running on http://localhost:${PORT}`);
});