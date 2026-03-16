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
  assigned_staff_id?: string;
}

interface Employee {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface TimeOffRequest {
  id: string;
  hairdresser_id: string;
  hairdresser_email?: string;
  start_date: string;
  end_date: string;
  note?: string;
  status: "pending" | "approved" | "denied";
  created_at: string;
}

type Tab = "appointments" | "employees" | "timeoff";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const [tab, setTab] = useState<Tab>("appointments");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New employee form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("HAIRDRESSER");
  const [empSubmitting, setEmpSubmitting] = useState(false);
  const [empSuccess, setEmpSuccess] = useState("");
  const [empError, setEmpError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function handleDeactivate(id: string) {
    try {
      await apiPost(
        `/api/admin/users/${id}/deactivate`,
        {},
        token ?? undefined,
      );
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_active: false } : e)),
      );
    } catch (err: unknown) {
      setEmpError(err instanceof Error ? err.message : "Failed to deactivate");
    }
  }

  async function handleReactivate(id: string) {
    try {
      await apiPost(
        `/api/admin/users/${id}/reactivate`,
        {},
        token ?? undefined,
      );
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_active: true } : e)),
      );
    } catch (err: unknown) {
      setEmpError(err instanceof Error ? err.message : "Failed to reactivate");
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiPost(`/api/admin/users/${id}/delete`, {}, token ?? undefined);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      setConfirmDeleteId(null);
    } catch (err: unknown) {
      setEmpError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      setError("");
      try {
        const [apptRes, empRes, toRes] = await Promise.allSettled([
          apiGet<{ ok: boolean; appointments: Appointment[] }>(
            "/api/admin/appointments",
            token ?? undefined,
          ),
          apiGet<{ ok: boolean; users: Employee[] }>(
            "/api/admin/users",
            token ?? undefined,
          ),
          apiGet<{ ok: boolean; requests: TimeOffRequest[] }>(
            "/api/admin/time-off",
            token ?? undefined,
          ),
        ]);

        if (apptRes.status === "fulfilled")
          setAppointments(apptRes.value.appointments ?? []);
        if (empRes.status === "fulfilled")
          setEmployees(empRes.value.users ?? []);
        if (toRes.status === "fulfilled")
          setTimeOffRequests(toRes.value.requests ?? []);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [token]);

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();
    setEmpSubmitting(true);
    setEmpSuccess("");
    setEmpError("");
    try {
      await apiPost(
        "/api/admin/users",
        { email: newEmail, tempPassword: newPassword, role: newRole },
        token ?? undefined,
      );
      setEmpSuccess(`Employee ${newEmail} created!`);
      setNewEmail("");
      setNewPassword("");
      setNewRole("HAIRDRESSER");
      const res = await apiGet<{ ok: boolean; users: Employee[] }>(
        "/api/admin/users",
        token ?? undefined,
      );
      setEmployees(res.users ?? []);
    } catch (err: unknown) {
      setEmpError(
        err instanceof Error ? err.message : "Failed to create employee",
      );
    } finally {
      setEmpSubmitting(false);
    }
  }

  async function handleTimeOffAction(
    id: string,
    action: "approved" | "denied",
  ) {
    try {
      await apiPost(
        `/api/admin/time-off/${id}`,
        { status: action },
        token ?? undefined,
      );
      setTimeOffRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: action } : r)),
      );
    } catch {
      setError("Failed to update request");
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
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
      pending: "badge-pending",
      approved: "badge-confirmed",
      denied: "badge-cancelled",
    };
    return map[status?.toLowerCase()] ?? "badge-pending";
  }

  const pendingTimeOff = timeOffRequests.filter((r) => r.status === "pending");
  const upcoming = appointments.filter(
    (a) => new Date(a.datetime) >= new Date() && a.status !== "cancelled",
  );

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Staff Portal · {user?.role}</p>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">{user?.email}</p>
        </div>
        <button className="btn-outline" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* Stat Cards */}
      <div className="stat-row">
        <div className="stat-card">
          <p className="stat-label">Upcoming Appointments</p>
          <p className="stat-value">{upcoming.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Appointments</p>
          <p className="stat-value">{appointments.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Staff</p>
          <p className="stat-value">
            {employees.filter((e) => e.is_active).length}
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending Time Off</p>
          <p className="stat-value">{pendingTimeOff.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        <button
          className={`tab-btn ${tab === "appointments" ? "tab-active" : ""}`}
          onClick={() => setTab("appointments")}
        >
          All Appointments
        </button>
        <button
          className={`tab-btn ${tab === "employees" ? "tab-active" : ""}`}
          onClick={() => setTab("employees")}
        >
          Employees
        </button>
        <button
          className={`tab-btn ${tab === "timeoff" ? "tab-active" : ""}`}
          onClick={() => setTab("timeoff")}
        >
          Time Off
          {pendingTimeOff.length > 0 && (
            <span className="tab-badge">{pendingTimeOff.length}</span>
          )}
        </button>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      {/* ── APPOINTMENTS TAB ── */}
      {tab === "appointments" && (
        <div className="dashboard-section">
          {loading ? (
            <p className="dashboard-empty">Loading…</p>
          ) : appointments.length === 0 ? (
            <p className="dashboard-empty">No appointments yet.</p>
          ) : (
            <div className="appt-list">
              {appointments.map((a) => (
                <div key={a.id} className="appt-card">
                  <div className="appt-main">
                    <p className="appt-service">{a.service_name}</p>
                    <p className="appt-datetime">
                      {formatDate(a.datetime)} &middot; {formatTime(a.datetime)}
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
                    {a.customer_email && (
                      <p className="appt-client-sub">
                        <a href={`mailto:${a.customer_email}`}>
                          {a.customer_email}
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
          )}
        </div>
      )}

      {/* ── EMPLOYEES TAB ── */}
      {tab === "employees" && (
        <div className="dashboard-section">
          <p className="section-label">Add Employee</p>
          <form className="timeoff-form" onSubmit={handleAddEmployee}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="emp-email">
                  Email
                </label>
                <input
                  id="emp-email"
                  className="form-input"
                  type="email"
                  placeholder="stylist@barclays.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="emp-role">
                  Role
                </label>
                <select
                  id="emp-role"
                  className="form-input"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="HAIRDRESSER">Hairdresser</option>
                  <option value="OWNER">Owner</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="emp-pass">
                Temporary Password
              </label>
              <input
                id="emp-pass"
                className="form-input"
                type="text"
                placeholder="They'll be prompted to reset this"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="btn-primary"
              type="submit"
              disabled={empSubmitting}
            >
              {empSubmitting ? "Creating…" : "Create Employee"}
            </button>
            {empSuccess && <p className="form-success">{empSuccess}</p>}
            {empError && <p className="dashboard-error">{empError}</p>}
          </form>

          {employees.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: "2rem" }}>
                Staff
              </p>
              <div className="appt-list">
                {employees.map((emp) => (
                  <div key={emp.id} className="appt-card">
                    <div className="appt-main">
                      <p className="appt-service">{emp.email}</p>
                      <p className="appt-datetime">{emp.role}</p>
                    </div>
                    <div className="appt-actions">
                      {confirmDeleteId === emp.id ? (
                        <>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#c62828",
                              marginRight: "6px",
                            }}
                          >
                            Are you sure?
                          </span>
                          <button
                            className="btn-deny"
                            onClick={() => handleDelete(emp.id)}
                          >
                            Yes, Delete
                          </button>
                          <button
                            className="btn-approve"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className={`badge ${emp.is_active ? "badge-confirmed" : "badge-cancelled"}`}
                          >
                            {emp.is_active ? "active" : "inactive"}
                          </span>
                          {emp.is_active ? (
                            <button
                              className="btn-deny"
                              onClick={() => handleDeactivate(emp.id)}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="btn-approve"
                              onClick={() => handleReactivate(emp.id)}
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            className="btn-deny"
                            style={{
                              background: "#fce4ec",
                              borderColor: "#e57373",
                            }}
                            onClick={() => setConfirmDeleteId(emp.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── TIME OFF TAB ── */}
      {tab === "timeoff" && (
        <div className="dashboard-section">
          {timeOffRequests.length === 0 ? (
            <p className="dashboard-empty">No time-off requests.</p>
          ) : (
            <div className="appt-list">
              {timeOffRequests.map((r) => (
                <div key={r.id} className="appt-card">
                  <div className="appt-main">
                    <p className="appt-service">
                      {r.hairdresser_email ?? "Staff member"}
                    </p>
                    <p className="appt-datetime">
                      {formatDate(r.start_date)}
                      {r.start_date !== r.end_date &&
                        ` — ${formatDate(r.end_date)}`}
                    </p>
                    {r.note && <p className="appt-client">{r.note}</p>}
                  </div>
                  <div className="appt-actions">
                    {r.status === "pending" ? (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleTimeOffAction(r.id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-deny"
                          onClick={() => handleTimeOffAction(r.id, "denied")}
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      <span className={`badge ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
