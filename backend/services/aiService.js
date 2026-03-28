import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
console.log("🔑 API KEY:", process.env.GROQ_API_KEY ? "Loaded" : "Missing");

/**
 * Builds the system prompt that tells the AI exactly what to do
 * and what JSON shape to return.
 */
function buildSystemPrompt() {
  return `You are Factify, an expert fact-checking assistant that specialises in
detecting fake news, misinformation, and misleading content – especially the kind
that spreads via WhatsApp forwards, social media posts, and online news articles.

Your job:

You MUST follow this reasoning process:

1. Extract the main factual claim from the user's input.
2. Determine the actual real-world fact.
3. Compare the claim with reality.
4. Decide if the claim is TRUE or FALSE.
5. If FALSE, explain why it contradicts real-world facts.

Decision rules:

* If the claim contradicts reality → mark as "Fake".
* If the claim matches reality → mark as "Verified".
* If partly correct or missing context → mark as "Misleading".
* Do NOT be neutral. You must take a clear stance.


{
  "status": "Verified" or "Fake" or "Misleading",
  "confidence": <integer 0-100>,
  - The title MUST be exactly one of the following:
  "Credible Information", "Fake Alert", or "Misleading Content".
- Do NOT combine multiple titles.
- Do NOT use separators like "|" or ",".
  "explanation": "<simple, friendly explanation for everyday users aged 16–60 – avoid jargon>",
  "signals": [
    "<signal 1>",
    "<signal 2>"
  ],
  "sources": [
    "<URL or name of a reliable reference>"
  ]
}

Rules you must follow:

- Always compare the claim with real-world facts before deciding.
- You MUST verify factual correctness using real-world knowledge.
- If the claim contradicts real-world facts, it MUST be marked as "Fake".
- Do NOT assume the statement is true.
- Treat the input strictly as a CLAIM that needs verification.
- Use plain, simple language in explanation. Imagine explaining to a first-time smartphone user.
- Detect WhatsApp-style patterns: urgency words ("SHARE IMMEDIATELY"), impossible statistics, appeals to fear, missing author/date, poor grammar.
- confidence must be a plain number (e.g. 87), NOT a string.
- sources should be real, recognisable references (e.g. WHO, Reuters, India Today, PIB, Snopes). If none apply, return an empty array [].
- signals should list 2–5 brief reasons that influenced your decision.
- NEVER return anything other than the JSON object described above.
- Do NOT be neutral. You must take a clear stance: Verified, Fake, or Misleading.
- If unsure, prefer "Misleading" over "Verified".
`;
}

/**
 * analyzeText
 * -----------
 * Sends the user's text to GPT-4o-mini and returns the parsed JSON result.
 *
 * @param {string} text – The news / WhatsApp forward to analyse
 * @returns {Promise<object>} – The parsed AI response object
 */
async function analyzeText(text) {
  try {
    const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: buildSystemPrompt() },
    { role: "user", content: text },
  ],
  temperature: 0.3,
  response_format: { type: "json_object" } // 🔥 ADD THIS LINE
});

    const rawContent = response.choices[0].message.content.trim();

    console.log("🧠 RAW RESPONSE:", rawContent);

    // ── Parse the JSON the model returned ────────────────────────────────────
    let parsed;

    try {
      // Happy path: model returned clean JSON
      parsed = JSON.parse(rawContent);
    } catch (_) {
      // Fallback: model may have wrapped it in ```json … ``` fences
      const match = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (match) {
        try {
          parsed = JSON.parse(match[1].trim());
        } catch (__) {
          throw new Error("Could not parse AI response as JSON even after stripping fences.");
        }
      } else {
        // Last resort: find the first { … } block in the text
        const braceMatch = rawContent.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          parsed = JSON.parse(braceMatch[0]);
        } else {
          throw new Error("AI response contained no recognisable JSON object.");
        }
      }
    }

    // ── Validate and normalise fields ─────────────────────────────────────────
    const validStatuses = ["Verified", "Fake", "Misleading"];

    return {
      status:      validStatuses.includes(parsed.status) ? parsed.status : "Misleading",
      confidence:  typeof parsed.confidence === "number"
                     ? Math.min(100, Math.max(0, Math.round(parsed.confidence)))
                     : 50,
      title:       typeof parsed.title === "string" && parsed.title.trim()
                     ? parsed.title.trim()
                     : "Analysis Complete",
      explanation: typeof parsed.explanation === "string" && parsed.explanation.trim()
                     ? parsed.explanation.trim()
                     : "No explanation provided.",
      signals:     Array.isArray(parsed.signals) ? parsed.signals.filter(s => typeof s === "string") : [],
      sources:     Array.isArray(parsed.sources) ? parsed.sources.filter(s => typeof s === "string") : [],
    };

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

    throw new Error("AI analysis failed");
  }
}
export { analyzeText };