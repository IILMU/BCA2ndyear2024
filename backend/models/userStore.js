import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data/users.json');

// ── Read/write helpers ────────────────────────────────────────────────────────
function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// ── Public API ────────────────────────────────────────────────────────────────
export function findByEmail(email) {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findById(id) {
  return readUsers().find(u => u.id === id) || null;
}

export function createUser({ name, email, passwordHash }) {
  const users = readUsers();
  const user = {
    id:           randomUUID(),
    name:         name.trim(),
    email:        email.toLowerCase().trim(),
    passwordHash,
    createdAt:    new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}
