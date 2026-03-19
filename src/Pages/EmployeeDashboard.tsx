import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/useAuth";
import { apiGet, apiPost } from "../api/client";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "../Components/ErrorBoundary";
import { timeOffSchema } from "../lib/schemas";

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
  const queryClient = useQueryClient();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const [tab, setTab] = useState<Tab>("schedule");
  const [toStartDate, setToStartDate] = useState("");
  const [toEndDate, setToEndDate] = useState("");
  const [toNote, setToNote] = useState("");
  const [toSuccess, setToSuccess] = useState(false);

  // ── Queries ────────────────────────────────────────────
  const {
    data: appointments = [],
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useQuery({
    queryKey: ["employee-schedule", token],
    queryFn: async () => {
      const res = await apiGet<{ ok: boolean; appointments: Appointment[] }>(
        "/api/employee/schedule",
        token ?? undefined,
      );
      return res.appointments ?? [];
    },
    enabled: !!token,
  });

  const { data: timeOffRequests = [] } = useQuery({
    queryKey: ["employee-timeoff", token],
    queryFn: async () => {
      const res = await apiGet<{ ok: boolean; requests: TimeOffRequest[] }>(
        "/api/employee/time-off",
        token ?? undefined,
      );
      return res.requests ?? [];
    },
    enabled: !!token,
  });

  // ── Mutation ───────────────────────────────────────────
  const submitTimeOffMutation = useMutation({
    mutationFn: () =>
      apiPost(
        "/api/employee/time-off",
        { start_date: toStartDate, end_date: toEndDate, note: toNote },
        token ?? undefined,
      ),
    onSuccess: () => {
      setToSuccess(true);
      setToStartDate("");
      setToEndDate("");
      setToNote("");
      queryClient.invalidateQueries({ queryKey: ["employee-timeoff"] });
    },
  });

  // ── Helpers ────────────────────────────────────────────
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

      <ErrorBoundary section="Stats">
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
      </ErrorBoundary>

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

      {scheduleError && (
        <p className="dashboard-error">
          {scheduleError instanceof Error
            ? scheduleError.message
            : "Failed to load schedule"}
        </p>
      )}

      {tab === "schedule" && (
        <ErrorBoundary section="Schedule">
          <div className="dashboard-section">
            {scheduleLoading ? (
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
        </ErrorBoundary>
      )}

      {tab === "timeoff" && (
        <ErrorBoundary section="Time Off">
          <div className="dashboard-section">
            <p className="section-label">Request Time Off</p>
            <form
              className="timeoff-form"
              onSubmit={(e) => {
                e.preventDefault();
                setToSuccess(false);

                const result = timeOffSchema.safeParse({
                  start_date: toStartDate,
                  end_date: toEndDate,
                  note: toNote,
                });

                if (!result.success) {
                  // shows the first validation error e.g. "End date must be on or after start date"
                  submitTimeOffMutation.reset();
                  return submitTimeOffMutation.mutate === undefined
                    ? void 0
                    : (() => {
                        throw new Error(result.error.issues[0].message);
                      })();
                }

                submitTimeOffMutation.mutate();
              }}
            >
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
                disabled={submitTimeOffMutation.isPending}
              >
                {submitTimeOffMutation.isPending
                  ? "Submitting…"
                  : "Submit Request"}
              </button>
              {toSuccess && (
                <p className="form-success">
                  Request submitted! Your manager will review it.
                </p>
              )}
              {submitTimeOffMutation.isError && (
                <p className="dashboard-error">
                  {submitTimeOffMutation.error instanceof Error
                    ? submitTimeOffMutation.error.message
                    : "Failed to submit request"}
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
        </ErrorBoundary>
      )}
    </div>
  );
}
