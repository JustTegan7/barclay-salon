const bcrypt = require("bcrypt");
const { addEmployeeSchema } = require("./schemas");

async function createEmployee({ query }, req, res) {
  const parsed = addEmployeeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: parsed.error.issues[0].message,
    });
  }

  const { email, tempPassword, role } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const result = await query(
      `INSERT INTO users (
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
      RETURNING id, email, role, must_reset_password;`,
      [email, passwordHash, role],
    );

    return res.status(201).json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error("createEmployee error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

module.exports = { createEmployee };
