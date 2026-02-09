require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { pool, query, initDb } = require("./db");
const { createGuestAppointment } = require("./bookingController");

const app = express();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Allow your Vite frontend to call the API
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// ------------------------------
// Dev request logger (so backend terminal shows traffic)
// ------------------------------
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${
        res.statusCode
      } (${ms}ms)`
    );
  });

  next();
});

// ------------------------------
// Health checks (support both paths)
// ------------------------------
function healthPayload() {
  return {
    ok: true,
    service: "barclay-api",
    time: new Date().toISOString(),
    db: pool ? "postgres-enabled" : "in-memory",
  };
}

app.get(["/health", "/api/health"], (_req, res) => {
  res.json(healthPayload());
});

// ------------------------------
// Services (mock for now)
// ------------------------------
const services = [
  {
    id: "balayage",
    category: "Color",
    name: "Balayage",
    base_price_cents: 22000,
  },
  {
    id: "all-over-color",
    category: "Color",
    name: "All-Over Color",
    base_price_cents: 16000,
  },
  {
    id: "gloss-toner",
    category: "Color",
    name: "Gloss / Toner",
    base_price_cents: 8500,
  },
  {
    id: "womens-cut",
    category: "Cuts",
    name: "Women’s Cut",
    base_price_cents: 6500,
  },
  {
    id: "mens-cut",
    category: "Cuts",
    name: "Men’s Cut",
    base_price_cents: 4500,
  },
  {
    id: "kids-cut",
    category: "Cuts",
    name: "Kids Cut",
    base_price_cents: 3000,
  },
  {
    id: "blowout",
    category: "Styling",
    name: "Blowout",
    base_price_cents: 4500,
  },
  {
    id: "special-occasion-style",
    category: "Styling",
    name: "Special Occasion Style",
    base_price_cents: 8500,
  },
];

function findService(serviceId) {
  return services.find((s) => s.id === serviceId) || null;
}

app.get(["/services", "/api/services"], (_req, res) => {
  res.json(services);
});

// ------------------------------
// V1 customer-less auth placeholder (staff auth later)
// ------------------------------
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body || {};
  if (!email)
    return res.status(400).json({ ok: false, error: "email required" });

  res.json({
    ok: true,
    token: "dev-token",
    user: { email, role: "staff" },
  });
});

// ------------------------------
// Appointments (DB-backed if DATABASE_URL exists, else in-memory)
// ------------------------------
const memoryAppointments = [];

function isConflictInMemory(serviceId, datetimeIso) {
  return memoryAppointments.some(
    (a) =>
      a.service_id === serviceId &&
      a.datetime === datetimeIso &&
      String(a.status).toLowerCase() !== "cancelled"
  );
}

async function isConflictInDb(serviceId, datetimeIso) {
  // Uses DB-mode appointments table from your initDb()
  const r = await query(
    `
    SELECT 1
    FROM appointments
    WHERE service_id = $1
      AND datetime = $2
      AND status <> 'cancelled'
    LIMIT 1;
    `,
    [serviceId, datetimeIso]
  );
  return r.rows.length > 0;
}

/**
 * POST /api/appointments
 * Frontend should send:
 * { name, phone, email, serviceId, datetime }
 *
 * We will map serviceId -> serviceName here (trusted from our services list).
 */
app.post("/api/appointments", async (req, res) => {
  try {
    const { name, phone, email, serviceId, datetime } = req.body || {};

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

// Backwards-compatible alias (older endpoint)
// POST /api/bookings
// Legacy body: { name, phone, service, datetime, email }
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

// ------------------------------
// Admin: list appointments (debug/admin view for now)
// ------------------------------
app.get("/api/admin/appointments", async (_req, res) => {
  try {
    if (pool) {
      await initDb();
      const result = await query(
        `
        SELECT ga.*,
               c.name  AS customer_name,
               c.email AS customer_email,
               c.phone AS customer_phone
        FROM guest_appointments ga
        LEFT JOIN customers c ON c.id = ga.customer_id
        ORDER BY ga.datetime ASC;
        `
      );

      return res.json({ ok: true, appointments: result.rows });
    }

    return res.json({ ok: true, appointments: memoryAppointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Latest appointment (debug gold)
app.get("/api/admin/appointments/latest", async (_req, res) => {
  try {
    if (pool) {
      await initDb();
      const result = await query(
        `SELECT * FROM guest_appointments ORDER BY created_at DESC LIMIT 1;`
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

// ------------------------------
// Start server
// ------------------------------
app.listen(PORT, async () => {
  if (pool) {
    try {
      await initDb();
      console.log("DB ready ✅");
    } catch (e) {
      console.log("DB init failed — running anyway (check DATABASE_URL).");
      console.error(e);
    }
  }

  console.log(`API running on http://localhost:${PORT}`);
  console.log(`CORS allowed origin: ${CLIENT_ORIGIN}`);
  console.log(`Try: http://localhost:${PORT}/health`);
  console.log(`Try: http://localhost:${PORT}/services`);
});
