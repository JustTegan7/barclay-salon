const bcrypt = require("bcrypt");

/**
 * POST /api/admin/users
 * Admin / Owner only
 *
 * Body:
 * {
 *   email: string,
 *   tempPassword: string,
 *   role?: "HAIRDRESSER" | "OWNER"
 * }
 */
async function createEmployee({ query }, req, res) {
  try {
    const { email, tempPassword, role = "HAIRDRESSER" } = req.body || {};

    if (!email || !tempPassword) {
      return res
        .status(400)
        .json({ ok: false, error: "email and tempPassword required" });
    }

    const allowedRoles = ["HAIRDRESSER", "OWNER"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid role",
      });
    }

    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const result = await query(
      `
      INSERT INTO users (
        email,
        password_hash,
        role,
        must_reset_password,
        is_active
      )
      VALUES ($1, $2, $3, true, true)
      ON CONFLICT (email)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        must_reset_password = true,
        is_active = true
      RETURNING id, email, role, must_reset_password;
      `,
      [email, passwordHash, role],
    );

    return res.status(201).json({
      ok: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.error("createEmployee error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

module.exports = { createEmployee };
