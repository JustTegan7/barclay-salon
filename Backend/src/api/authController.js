// Backend/src/api/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

// POST /api/auth/login
async function login({ query }, req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "email and password required" });
  }

  const result = await query(
    `SELECT id, email, password_hash, role
     FROM users
     WHERE email = $1 AND is_active = true
     LIMIT 1;`,
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const token = signToken(user);

  return res.json({
    ok: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}

module.exports = { login };
