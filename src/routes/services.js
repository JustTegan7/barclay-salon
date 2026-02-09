// Backend/src/routes/services.js
const express = require("express");
const router = express.Router();

/**
 * GET /services
 * Public: customers can read the service menu
 */
router.get("/", async (req, res) => {
  const pool = req.app.get("db");

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        category,
        base_price_cents,
        duration_minutes,
        is_active,
        created_at,
        updated_at
      FROM services
      WHERE is_active = TRUE
      ORDER BY category, name
      `
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("GET /services failed:", err);
    return res.status(500).json({ error: "Failed to load services" });
  }
});

module.exports = router;
