/**
 * Writes one row to audit_log.
 * Never throws — audit failure should never break the main request.
 */
async function writeAudit(
  query,
  { userId, userEmail, userRole, action, targetId = null, detail = {} },
) {
  try {
    await query(
      `INSERT INTO audit_log (user_id, user_email, user_role, action, target_id, detail)
       VALUES ($1, $2, $3, $4, $5, $6);`,
      [userId, userEmail, userRole, action, targetId, JSON.stringify(detail)],
    );
  } catch (err) {
    console.error("[audit] Failed to write audit log:", err);
  }
}

module.exports = { writeAudit };
