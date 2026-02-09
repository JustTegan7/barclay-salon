// src/api/bookingController.js
//
// V1 focus: guest bookings (no auth required)
// Future: staff scheduling & availability (kept intentionally separate)

/* ==============================
   Utilities
================================ */

function setTimeFromMinutes(baseDate, minutes) {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minutes);
  return d;
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  // [start, end) overlap check
  return aStart < bEnd && bStart < aEnd;
}

/* ==============================
   FUTURE: Staff scheduling logic
   (Not wired into V1 yet)
================================ */

/**
 * Find available start times for a hairdresser on a given day.
 * Uses future schema: availability, time_off, appointments.
 */
async function findAvailableSlots({
  pool,
  hairdresserId,
  serviceDurationMinutes,
  date,
  slotStepMinutes = 15,
}) {
  if (!pool) throw new Error("DB required for availability queries");
  if (!hairdresserId) throw new Error("hairdresserId required");
  if (!serviceDurationMinutes || serviceDurationMinutes <= 0)
    throw new Error("serviceDurationMinutes invalid");
  if (!date) throw new Error("date required");

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);
  const dow = dayStart.getDay();

  const availRes = await pool.query(
    `
    SELECT start_minute, end_minute
    FROM availability
    WHERE hairdresser_id = $1 AND day_of_week = $2
    ORDER BY start_minute ASC
    `,
    [hairdresserId, dow],
  );

  if (availRes.rows.length === 0) return [];

  const timeOffRes = await pool.query(
    `
    SELECT 1
    FROM time_off
    WHERE hairdresser_id = $1
      AND status = 'APPROVED'
      AND start_date <= $2::date
      AND end_date >= $2::date
    LIMIT 1;
    `,
    [hairdresserId, date],
  );

  if (timeOffRes.rows.length > 0) return [];

  const apptRes = await pool.query(
    `
    SELECT start_time, end_time
    FROM appointments
    WHERE hairdresser_id = $1
      AND status <> 'CANCELLED'
      AND start_time < $2
      AND end_time > $3
    ORDER BY start_time ASC
    `,
    [hairdresserId, dayEnd.toISOString(), dayStart.toISOString()],
  );

  const blocked = apptRes.rows.map((r) => ({
    start: new Date(r.start_time),
    end: new Date(r.end_time),
  }));

  const slots = [];

  for (const win of availRes.rows) {
    const winStart = setTimeFromMinutes(dayStart, win.start_minute);
    const winEnd = setTimeFromMinutes(dayStart, win.end_minute);

    for (
      let cur = new Date(winStart);
      cur.getTime() + serviceDurationMinutes * 60 * 1000 <= winEnd.getTime();
      cur = new Date(cur.getTime() + slotStepMinutes * 60 * 1000)
    ) {
      const start = cur;
      const end = new Date(start.getTime() + serviceDurationMinutes * 60000);

      if (!blocked.some((b) => overlaps(start, end, b.start, b.end))) {
        slots.push(start.toISOString());
      }
    }
  }

  return slots;
}

/* ==============================
   V1: Guest booking (LIVE)
================================ */

/**
 * Create a guest appointment (no login required).
 * Works in both DB-backed and in-memory modes.
 */
async function createGuestAppointment({
  query,
  pool,
  memoryAppointments,
  payload,
}) {
  const { name, phone, email, serviceId, serviceName, datetime } =
    payload || {};

  if (!name || !serviceId || !serviceName || !datetime) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "name, serviceId, serviceName, datetime required",
      },
    };
  }

  const dt = new Date(datetime);
  if (Number.isNaN(dt.getTime())) {
    return { status: 400, body: { ok: false, error: "Invalid datetime" } };
  }

  if (dt.getTime() < Date.now()) {
    return {
      status: 400,
      body: { ok: false, error: "Cannot book in the past" },
    };
  }

  const datetimeIso = dt.toISOString();

  /* ------------------------------
     Conflict detection (exact match)
  ------------------------------- */
  if (pool) {
    const conflict = await query(
      `
      SELECT 1
      FROM guest_appointments
      WHERE service_id = $1
        AND datetime = $2
        AND LOWER(status) <> 'cancelled'
      LIMIT 1;
      `,
      [serviceId, datetimeIso],
    );

    if (conflict.rows.length > 0) {
      return {
        status: 409,
        body: {
          ok: false,
          error: "That time was just requested. Please pick another slot.",
        },
      };
    }
  } else {
    const conflict = memoryAppointments.some(
      (a) =>
        a.service_id === serviceId &&
        a.datetime === datetimeIso &&
        String(a.status).toLowerCase() !== "cancelled",
    );

    if (conflict) {
      return {
        status: 409,
        body: {
          ok: false,
          error: "That time was just requested. Please pick another slot.",
        },
      };
    }
  }

  /* ------------------------------
     DB-backed mode
  ------------------------------- */
  if (pool) {
    let customerId;

    const existing =
      email || phone
        ? await query(
            `
            SELECT id FROM customers
            WHERE ($1::text IS NOT NULL AND email = $1)
               OR ($2::text IS NOT NULL AND phone = $2)
            ORDER BY id DESC
            LIMIT 1;
            `,
            [email || null, phone || null],
          )
        : { rows: [] };

    if (existing.rows[0]) {
      customerId = existing.rows[0].id;
    } else {
      const created = await query(
        `
        INSERT INTO customers (name, email, phone)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
        [name, email || null, phone || null],
      );
      customerId = created.rows[0].id;
    }

    const inserted = await query(
      `
      INSERT INTO guest_appointments
        (customer_id, service_id, service_name, datetime, status)
      VALUES ($1, $2, $3, $4, 'requested')
      RETURNING id, service_id, service_name, datetime, status, created_at;
      `,
      [customerId, serviceId, serviceName, datetimeIso],
    );

    const row = inserted.rows[0];

    return {
      status: 201,
      body: {
        ok: true,
        appointment: {
          id: row.id,
          service_id: row.service_id,
          service_name: row.service_name,
          datetime: row.datetime,
          status: row.status,
          created_at: row.created_at,
        },
      },
    };
  }

  /* ------------------------------
     In-memory fallback
  ------------------------------- */
  const appt = {
    id: `mem_${Date.now()}`,
    service_id: serviceId,
    service_name: serviceName,
    datetime: datetimeIso,
    status: "requested",
    created_at: new Date().toISOString(),
    customer_name: name,
    customer_phone: phone || null,
    customer_email: email || null,
  };

  memoryAppointments.push(appt);

  return { status: 201, body: { ok: true, appointment: appt } };
}

module.exports = {
  findAvailableSlots,
  createGuestAppointment,
};
