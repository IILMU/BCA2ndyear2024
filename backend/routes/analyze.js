// ================================================
// routes/analyze.js – POST /api/analyze
// ================================================

import express from "express";
import { analyzeText } from "../services/aiService.js";

const router = express.Router();

/**
 * POST /api/analyze
 * Body: { "text": "..." }
 *
 * Analyses the supplied text and returns a structured fact-check result.
 */
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("📩 Text received:", text);

    // ── Input Validation ──────────────────────────
    if (!text || typeof text !== "string") {
      return res.status(400).json({
        success: false,
        error: "Please provide a 'text' field in the request body.",
      });
    }

    const trimmedText = text.trim();

    if (trimmedText.length === 0) {
      return res.status(400).json({
        success: false,
        error: "The 'text' field cannot be empty.",
      });
    }

    if (trimmedText.length < 10) {
      return res.status(400).json({
        success: false,
        error: "Please provide at least 10 characters of text to analyse.",
      });
    }

    if (trimmedText.length > 5000) {
      return res.status(400).json({
        success: false,
        error: "Text is too long. Please limit your input to 5000 characters.",
      });
    }

    // ── AI Analysis ───────────────────────────────
    console.log("🚀 Sending to AI:", trimmedText);
    const result = await analyzeText(trimmedText);

    // ── Success Response ──────────────────────────
    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("❌ FULL ERROR:", error);

    // Handle OpenAI-specific errors with a clear message
    if (error.status === 401) {
      return res.status(500).json({
  success: false,
  error: "AI failed to analyze the content. Please try again.",
});
    }

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please wait a moment and try again.",
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong. Please try again.",
    });
  }
});

export default router;
