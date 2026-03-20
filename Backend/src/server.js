require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { pool, query, initDb } = require("./db");
const { createGuestAppointment } = require("./api/bookingController");

const { authRequired, requireRole } = require("./api/authMiddleware");
const { createEmployee } = require("./api/userController");
const { login } = require("./api/authController");

const { loginLimiter } = require("./api/rateLimiter");

const { writeAudit } = require("./api/audit");

const app = express();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// ------------------------------
// Dev request logger
// ------------------------------
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`,
    );
  });
  next();
});

// ------------------------------
// Health check
// ------------------------------
app.get(["/health", "/api/health"], (_req, res) => {
  res.json({
    ok: true,
    service: "barclay-api",
    time: new Date().toISOString(),
    db: pool ? "postgres-enabled" : "in-memory",
  });
});

// ------------------------------
// Services — full catalog from services.js
// ------------------------------
const services = require("./services");

function findService(serviceId) {
  return services.find((s) => s.id === serviceId) || null;
}

app.get(["/services", "/api/services"], (_req, res) => res.json(services));

// ── Public: list active hairdressers for booking ──
app.get("/api/staff", async (_req, res) => {
  try {
    if (pool) {
      const result = await query(
        `SELECT id, email, display_name
         FROM users
         WHERE is_active = true AND role = 'HAIRDRESSER'
         ORDER BY display_name ASC, email ASC;`,
      );
      return res.json({ ok: true, staff: result.rows });
    }
    return res.json({ ok: true, staff: [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ══════════════════════════════
// AUTH
// ══════════════════════════════

app.post("/api/auth/login", loginLimiter, (req, res) =>
  login({ query }, req, res),
);

// ══════════════════════════════
// ADMIN — USERS
// ══════════════════════════════

// Create employee
app.post(
  "/api/admin/users",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  (req, res) => createEmployee({ query }, req, res),
);

// List all employees
app.get(
  "/api/admin/users",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const result = await query(
        `SELECT id, email, role, is_active, created_at
         FROM users
         ORDER BY created_at DESC;`,
      );
      return res.json({ ok: true, users: result.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// ══════════════════════════════
// ADMIN — APPOINTMENTS
// ══════════════════════════════

// All appointments
app.get(
  "/api/admin/appointments",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (_req, res) => {
    try {
      if (pool) {
        await initDb();
        const result = await query(
          `SELECT ga.*,
                  c.name  AS customer_name,
                  c.email AS customer_email,
                  c.phone AS customer_phone
           FROM guest_appointments ga
           LEFT JOIN customers c ON c.id = ga.customer_id
           ORDER BY ga.datetime ASC;`,
        );
        return res.json({ ok: true, appointments: result.rows });
      }
      return res.json({ ok: true, appointments: memoryAppointments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// Latest appointment (debug)
app.get("/api/admin/appointments/latest", async (_req, res) => {
  try {
    if (pool) {
      await initDb();
      const result = await query(
        `SELECT * FROM guest_appointments ORDER BY created_at DESC LIMIT 1;`,
      );
      return res.json({ ok: true, appointment: result.rows[0] || null });
    }
    return res.json({
      ok: true,
      appointment: memoryAppointments[memoryAppointments.length - 1] || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ══════════════════════════════
// ADMIN — TIME OFF
// ══════════════════════════════

// View all time-off requests
app.get(
  "/api/admin/time-off",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (_req, res) => {
    try {
      const result = await query(
        `SELECT t.*, u.email AS hairdresser_email
         FROM time_off_requests t
         JOIN users u ON u.id = t.user_id
         ORDER BY t.created_at DESC;`,
      );
      return res.json({ ok: true, requests: result.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// Approve or deny a time-off request
app.post(
  "/api/admin/time-off/:id",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const { status } = req.body || {};
      if (!["approved", "denied"].includes(status)) {
        return res
          .status(400)
          .json({ ok: false, error: "status must be approved or denied" });
      }
      const result = await query(
        `UPDATE time_off_requests SET status = $1 WHERE id = $2 RETURNING id, status;`,
        [status, req.params.id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ ok: false, error: "Request not found" });
      }
      return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// ══════════════════════════════
// EMPLOYEE — SCHEDULE
// ══════════════════════════════

app.get(
  "/api/employee/schedule",
  authRequired,
  requireRole(["HAIRDRESSER", "OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const result = await query(
        `SELECT ga.*,
                c.name  AS customer_name,
                c.email AS customer_email,
                c.phone AS customer_phone
         FROM guest_appointments ga
         LEFT JOIN customers c ON c.id = ga.customer_id
         WHERE ga.assigned_staff_id = $1
         ORDER BY ga.datetime ASC;`,
        [req.user.id],
      );
      return res.json({ ok: true, appointments: result.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// ══════════════════════════════
// EMPLOYEE — TIME OFF
// ══════════════════════════════

// Submit a time-off request
app.post(
  "/api/employee/time-off",
  authRequired,
  requireRole(["HAIRDRESSER", "OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const { start_date, end_date, note } = req.body || {};
      if (!start_date || !end_date) {
        return res
          .status(400)
          .json({ ok: false, error: "start_date and end_date required" });
      }
      const result = await query(
        `INSERT INTO time_off_requests (user_id, start_date, end_date, note)
         VALUES ($1, $2, $3, $4)
         RETURNING id, start_date, end_date, note, status, created_at;`,
        [req.user.id, start_date, end_date, note || null],
      );
      return res.status(201).json({ ok: true, request: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// View own time-off requests
app.get(
  "/api/employee/time-off",
  authRequired,
  requireRole(["HAIRDRESSER", "OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const result = await query(
        `SELECT * FROM time_off_requests
         WHERE user_id = $1
         ORDER BY created_at DESC;`,
        [req.user.id],
      );
      return res.json({ ok: true, requests: result.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// ══════════════════════════════
// GUEST BOOKINGS
// ══════════════════════════════

const memoryAppointments = [];

app.post("/api/appointments", async (req, res) => {
  try {
    const { name, phone, email, serviceId, datetime, hairdresserId } =
      req.body || {};
    if (!name || !serviceId || !datetime) {
      return res
        .status(400)
        .json({ ok: false, error: "name, serviceId, datetime required" });
    }
    const svc = findService(serviceId);
    if (!svc)
      return res.status(400).json({ ok: false, error: "Unknown serviceId" });
    if (pool) await initDb();
    const result = await createGuestAppointment({
      query,
      pool,
      memoryAppointments,
      payload: {
        name,
        phone,
        email,
        serviceId,
        serviceName: svc.name,
        datetime,
      },
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Legacy alias
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, phone, service, datetime, email } = req.body || {};
    const serviceId = service;
    if (!name || !serviceId || !datetime) {
      return res
        .status(400)
        .json({ ok: false, error: "name, service, datetime required" });
    }
    const svc = findService(serviceId);
    if (!svc)
      return res.status(400).json({ ok: false, error: "Unknown service" });
    if (pool) await initDb();
    const result = await createGuestAppointment({
      query,
      pool,
      memoryAppointments,
      payload: {
        name,
        phone,
        email,
        serviceId,
        serviceName: svc.name,
        datetime,
      },
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ══════════════════════════════
// START SERVER
// ══════════════════════════════

// Initialize DB tables on startup
if (pool) {
  initDb()
    .then(() => console.log("DB ready ✅"))
    .catch((e) => console.error("DB init failed:", e));
}

// Local dev: start the server normally
// Vercel: export the app as a serverless function
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    console.log(`CORS allowed origin: ${CLIENT_ORIGIN}`);
    console.log(`Try: http://localhost:${PORT}/health`);
  });
}

// ══════════════════════════════
// EMPLOYEE — PROFILE
// ══════════════════════════════

// Get own profile
app.get("/api/employee/profile", authRequired, async (req, res) => {
  try {
    const result = await query(
      `SELECT email, display_name, phone, address FROM users WHERE id = $1;`,
      [req.user.id],
    );
    return res.json({ ok: true, profile: result.rows[0] ?? null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Update own profile
app.post("/api/employee/profile", authRequired, async (req, res) => {
  try {
    const { display_name, phone, address } = req.body || {};
    await query(
      `UPDATE users SET display_name = $1, phone = $2, address = $3 WHERE id = $4;`,
      [display_name || null, phone || null, address || null, req.user.id],
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Change own password
app.post("/api/employee/change-password", authRequired, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ ok: false, error: "Both passwords required" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ ok: false, error: "Password must be at least 8 characters" });
    }

    const result = await query(
      `SELECT password_hash FROM users WHERE id = $1;`,
      [req.user.id],
    );

    const user = result.rows[0];
    const bcrypt = require("bcrypt");
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return res
        .status(401)
        .json({ ok: false, error: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await query(
      `UPDATE users SET password_hash = $1, must_reset_password = false WHERE id = $2;`,
      [newHash, req.user.id],
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ══════════════════════════════
// ADMIN — EMPLOYEE MANAGEMENT
// ══════════════════════════════

// Deactivate employee
app.post(
  "/api/admin/users/:id/deactivate",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      await query(`UPDATE users SET is_active = false WHERE id = $1;`, [
        req.params.id,
      ]);
      await writeAudit(query, {
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: "DEACTIVATE_EMPLOYEE",
        targetId: req.params.id,
      });
      return res.json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// Reactivate employee
app.post(
  "/api/admin/users/:id/reactivate",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      await query(`UPDATE users SET is_active = true WHERE id = $1;`, [
        req.params.id,
      ]);
      await writeAudit(query, {
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: "REACTIVATE_EMPLOYEE",
        targetId: req.params.id,
      });
      return res.json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// Permanently delete employee
app.post(
  "/api/admin/users/:id/delete",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      if (String(req.params.id) === String(req.user.id)) {
        return res
          .status(400)
          .json({ ok: false, error: "You cannot delete your own account" });
      }
      await writeAudit(query, {
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: "DELETE_EMPLOYEE",
        targetId: req.params.id,
      });
      await query(`DELETE FROM users WHERE id = $1;`, [req.params.id]);
      return res.json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);

// Approve or deny time-off
app.post(
  "/api/admin/time-off/:id",
  authRequired,
  requireRole(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const { status } = req.body || {};
      if (!["approved", "denied"].includes(status)) {
        return res
          .status(400)
          .json({ ok: false, error: "status must be approved or denied" });
      }
      const result = await query(
        `UPDATE time_off_requests SET status = $1 WHERE id = $2 RETURNING id, status;`,
        [status, req.params.id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ ok: false, error: "Request not found" });
      }
      await writeAudit(query, {
        userId: req.user.id,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: `TIMEOFF_${status.toUpperCase()}`,
        targetId: req.params.id,
      });
      return res.json({ ok: true, request: result.rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  },
);
// Booked slots for a given date
app.get("/api/appointments/booked", async (req, res) => {
  try {
    const { date } = req.query; // e.g. 2026-03-21
    if (!date)
      return res.status(400).json({ ok: false, error: "date required" });

    const result = await query(
      `SELECT datetime FROM guest_appointments
       WHERE datetime::date = $1::date
       AND LOWER(status) <> 'cancelled'
       ORDER BY datetime ASC;`,
      [date],
    );

    return res.json({ ok: true, booked: result.rows.map((r) => r.datetime) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});
module.exports = app;
