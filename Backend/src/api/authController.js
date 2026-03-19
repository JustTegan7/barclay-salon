const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginSchema } = require("./schemas");
const { writeAudit } = require("./audit");

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "8h" },
  );
}

async function login({ query }, req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ ok: false, error: parsed.error.issues[0].message });
  }

  const { email, password } = parsed.data;

  const result = await query(
    `SELECT id, email, password_hash, role
     FROM users
     WHERE email = $1 AND is_active = true
     LIMIT 1;`,
    [email],
  );

  const user = result.rows[0];
  if (!user) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  await writeAudit(query, {
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    action: "LOGIN",
  });

  return res.json({
    ok: true,
    token: signToken(user),
    user: { id: user.id, email: user.email, role: user.role },
  });
}

module.exports = { login };
