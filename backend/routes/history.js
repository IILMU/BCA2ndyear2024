import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// TEMP STORE (replace with DB if needed)
let history = [];

// SAVE RESULT
router.post("/", verifyToken, (req, res) => {
  const { status, confidence, explanation, input } = req.body;

  const newEntry = {
    id: Date.now(),
    userId: req.user.id,
    input,
    status,
    confidence,
    explanation,
    createdAt: new Date(),
  };

  history.push(newEntry);

  res.json({ success: true, data: newEntry });
});

// GET USER HISTORY
router.get("/", verifyToken, (req, res) => {
  const userHistory = history.filter(h => h.userId === req.user.id);
  res.json({ success: true, data: userHistory });
});

export default router;