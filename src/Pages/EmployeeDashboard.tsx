import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiGet, apiPost } from "../api/client";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: string;
  service_name: string;
  datetime: string;
  status: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
}

interface TimeOffRequest {
  id: string;
  start_date: string;
  end_date: string;
  note?: string;
  status: "pending" | "approved" | "denied";
  created_at: string;
}

type Tab = "schedule" | "timeoff";

export default function EmployeeDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const [tab, setTab] = useState<Tab>("schedule");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toStartDate, setToStartDate] = useState("");
  const [toEndDate, setToEndDate] = useState("");
  const [toNote, setToNote] = useState("");
  const [toSubmitting, setToSubmitting] = useState(false);
  const [toSuccess, setToSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await apiGet<{ ok: boolean; appointments: Appointment[] }>(
          "/api/employee/schedule",
          token ?? undefined,
        );
        setAppointments(res.appointments ?? []);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load schedule",
        );
      } finally {
        setLoading(false);
      }
    }

    async function loadTimeOff() {
      try {
        const res = await apiGet<{ ok: boolean; requests: TimeOffRequest[] }>(
          "/api/employee/time-off",
          token ?? undefined,
        );
        setTimeOffRequests(res.requests ?? []);
      } catch {
        // silently fail — table may not exist yet
      }
    }

    load();
    loadTimeOff();
  }, [token]);

  async function handleTimeOffSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToSubmitting(true);
    setToSuccess(false);
    try {
      await apiPost(
        "/api/employee/time-off",
        { start_date: toStartDate, end_date: toEndDate, note: toNote },
        token ?? undefined,
      );
      setToSuccess(true);
      setToStartDate("");
      setToEndDate("");
      setToNote("");
      const res = await apiGet<{ ok: boolean; requests: TimeOffRequest[] }>(
        "/api/employee/time-off",
        token ?? undefined,
      );
      setTimeOffRequests(res.requests ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setToSubmitting(false);
    }
  }

  const upcoming = appointments.filter(
    (a) => new Date(a.datetime) >= new Date() && a.status !== "cancelled",
  );
  const past = appointments.filter((a) => new Date(a.datetime) < new Date());

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      requested: "badge-pending",
      confirmed: "badge-confirmed",
      cancelled: "badge-cancelled",
      completed: "badge-completed",
    };
    return map[status.toLowerCase()] ?? "badge-pending";
  }

  function timeOffBadge(status: string) {
    const map: Record<string, string> = {
      pending: "badge-pending",
      approved: "badge-confirmed",
      denied: "badge-cancelled",
    };
    return map[status] ?? "badge-pending";
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Staff Portal</p>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">{user?.email}</p>
        </div>
        <button className="btn-outline" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Upcoming</p>
          <p className="stat-value">{upcoming.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Appointments</p>
          <p className="stat-value">{appointments.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Time-Off Requests</p>
          <p className="stat-value">{timeOffRequests.length}</p>
        </div>
      </div>

      <div className="tab-row">
        <button
          className={`tab-btn ${tab === "schedule" ? "tab-active" : ""}`}
          onClick={() => setTab("schedule")}
        >
          My Schedule
        </button>
        <button
          className={`tab-btn ${tab === "timeoff" ? "tab-active" : ""}`}
          onClick={() => setTab("timeoff")}
        >
          Time Off
        </button>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      {tab === "schedule" && (
        <div className="dashboard-section">
          {loading ? (
            <p className="dashboard-empty">Loading appointments…</p>
          ) : upcoming.length === 0 && past.length === 0 ? (
            <p className="dashboard-empty">No appointments yet.</p>
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <p className="section-label">Upcoming</p>
                  <div className="appt-list">
                    {upcoming.map((a) => (
                      <div key={a.id} className="appt-card">
                        <div className="appt-main">
                          <p className="appt-service">{a.service_name}</p>
                          <p className="appt-datetime">
                            {formatDate(a.datetime)} &middot;{" "}
                            {formatTime(a.datetime)}
                          </p>
                          {a.customer_name && (
                            <p className="appt-client">{a.customer_name}</p>
                          )}
                          {a.customer_phone && (
                            <p className="appt-client-sub">
                              <a href={`tel:${a.customer_phone}`}>
                                {a.customer_phone}
                              </a>
                            </p>
                          )}
                        </div>
                        <span className={`badge ${statusBadge(a.status)}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {past.length > 0 && (
                <>
                  <p className="section-label" style={{ marginTop: "2rem" }}>
                    Past
                  </p>
                  <div className="appt-list">
                    {past.slice(0, 10).map((a) => (
                      <div key={a.id} className="appt-card appt-card-past">
                        <div className="appt-main">
                          <p className="appt-service">{a.service_name}</p>
                          <p className="appt-datetime">
                            {formatDate(a.datetime)} &middot;{" "}
                            {formatTime(a.datetime)}
                          </p>
                          {a.customer_name && (
                            <p className="appt-client">{a.customer_name}</p>
                          )}
                        </div>
                        <span className={`badge ${statusBadge(a.status)}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {tab === "timeoff" && (
        <div className="dashboard-section">
          <p className="section-label">Request Time Off</p>
          <form className="timeoff-form" onSubmit={handleTimeOffSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="to-start">
                  Start Date
                </label>
                <input
                  id="to-start"
                  className="form-input"
                  type="date"
                  value={toStartDate}
                  onChange={(e) => setToStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="to-end">
                  End Date
                </label>
                <input
                  id="to-end"
                  className="form-input"
                  type="date"
                  value={toEndDate}
                  onChange={(e) => setToEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="to-note">
                Note (optional)
              </label>
              <textarea
                id="to-note"
                className="form-textarea"
                placeholder="Any details for the manager…"
                value={toNote}
                onChange={(e) => setToNote(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              type="submit"
              disabled={toSubmitting}
            >
              {toSubmitting ? "Submitting…" : "Submit Request"}
            </button>
            {toSuccess && (
              <p className="form-success">
                Request submitted! Your manager will review it.
              </p>
            )}
          </form>

          {timeOffRequests.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: "2rem" }}>
                My Requests
              </p>
              <div className="appt-list">
                {timeOffRequests.map((r) => (
                  <div key={r.id} className="appt-card">
                    <div className="appt-main">
                      <p className="appt-service">
                        {formatDate(r.start_date)}
                        {r.start_date !== r.end_date &&
                          ` — ${formatDate(r.end_date)}`}
                      </p>
                      {r.note && <p className="appt-client">{r.note}</p>}
                      <p className="appt-datetime">
                        Submitted {formatDate(r.created_at)}
                      </p>
                    </div>
                    <span className={`badge ${timeOffBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
