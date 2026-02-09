// authMiddleware.js
// JWT auth + role-based access control (RBAC)

const jwt = require("jsonwebtoken");

/**
 * Adds req.user = { id, role, email } from JWT
 * Expects: Authorization: Bearer <token>
 */
function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing Authorization Bearer token" });
    }

    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize user shape
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * RBAC gate: requireRole(["ADMIN", "OWNER", ...])
 * - Admin has full access, so you can optionally “auto-allow” Admin.
 */
function requireRole(roles) {
  const allowed = new Set(roles);

  return (req, res, next) => {
    if (!req.user)
      return res
        .status(500)
        .json({ error: "authRequired must run before requireRole" });

    // Admin = full access (you asked for this explicitly)
    if (req.user.role === "ADMIN") return next();

    if (!allowed.has(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
}

module.exports = {
  authRequired,
  requireRole,
};
