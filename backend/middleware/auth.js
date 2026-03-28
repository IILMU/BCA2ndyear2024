import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'factify_jwt_secret_change_in_prod';

/**
 * Verify JWT middleware.
 * Attaches req.user = { id, name, email } if valid.
 * Returns 401 if missing or invalid.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
}

export { JWT_SECRET };
