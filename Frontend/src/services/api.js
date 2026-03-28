/**
 * Factify API Service
 * Centralised fetch wrapper for the backend at http://localhost:5000
 */

const API_URL = import.meta.env.VITE_API_URL;

// ── Helper: get stored JWT ────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("token");
}
// ── Analyse news / text ───────────────────────────────────────────────────────
/**
 * @param {string} text - Text to analyse
 * @param {string} [language="en"] - Language hint
 */
export async function analyzeNews(text, language = "en") {

  console.log("🚀 analyzeNews CALLED with:", text);

  console.log("🌐 Calling API:", `${API_URL}/api/analyze`);

  const res = await fetch(`${API_URL}/api/analyze`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text, language }),
});

console.log("📡 STATUS:", res.status);

  console.log("📩 Raw response received");

  if (!res.ok) {
    console.log("❌ Response not OK:", res.status);
    throw new Error(`Server error: ${res.status}`);
  }

  const json = await res.json();
  console.log("📦 FULL JSON:", json);

  console.log("📦 Parsed JSON:", json);

  if (!json) {
  console.error("❌ JSON PARSE FAILED");
  throw new Error("Invalid JSON response from server");
}

  return json.data;
}

// ── Auth: Register ────────────────────────────────────────────────────────────
export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Registration failed.");
  return json; // { token, user }
}

// ── Auth: Login ───────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Login failed.");
  return json; // { token, user }
}

// ── Auth: Get current user ────────────────────────────────────────────────────
export async function getMe() {
  const token = getToken();
  if (!token) throw new Error("No token found.");

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch user.");
  return json.user;
}
