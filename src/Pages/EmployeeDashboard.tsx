import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiGet, apiPost } from "../api/client.ts";
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

interface Profile {
  email: string;
  display_name: string;
  phone: string;
  address: string;
}

type Tab = "schedule" | "timeoff" | "profile";

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

  // Time-off form
  const [toStartDate, setToStartDate] = useState("");
  const [toEndDate, setToEndDate] = useState("");
  const [toNote, setToNote] = useState("");
  const [toSubmitting, setToSubmitting] = useState(false);
  const [toSuccess, setToSuccess] = useState(false);

  // Profile form
  const [profile, setProfile] = useState<Profile>({
    email: user?.email ?? "",
    display_name: "",
    phone: "",
    address: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await apiGet<{ ok: boolean; appointments: Appointment[] }>(
          "/api/employee/schedule",
          token ?? undefined
        );
        setAppointments(res.appointments ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load schedule");
      } finally {
        setLoading(false);
      }
    }

    async function loadTimeOff() {
      try {
        const res = await apiGet<{ ok: boolean; requests: TimeOffRequest[] }>(
          "/api/employee/time-off",
          token ?? undefined
        );
        setTimeOffRequests(res.requests ?? []);
      } catch {
        // silently fail
      }
    }

    async function loadProfile() {
      try {
        const res = await apiGet<{ ok: boolean; profile: Profile }>(
          "/api/employee/profile",
          token ?? undefined
        );
        if (res.profile) setProfile(res.profile);
      } catch {
        // silently fail — will use defaults
      }
    }

    load();
    loadTimeOff();
    loadProfile();
  }, [token]);

  async function handleTimeOffSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToSubmitting(true);
    setToSuccess(false);
    try {
      await apiPost(
        "/api/employee/time-off",
        { start_date: toStartDate, end_date: toEndDate, note: toNote },
        token ?? undefined
      );
      setToSuccess(true);
      setToStartDate("");
      setToEndDate("");
      setToNote("");
      const res = await apiGet<{ ok: boolean; requests: TimeOffRequest[] }>(
        "/api/employee/time-off",
        token ?? undefined
      );
      setTimeOffRequests(res.requests ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setToSubmitting(false);
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);
    setProfileError("");
    try {
      await apiPost(
        "/api/employee/profile",
        { display_name: profile.display_name, phone: profile.phone, address: profile.address },
        token ?? undefined
      );
      setProfileSuccess(true);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (newPassword !== confirmPassword) {
      setPwError("New passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }
    setPwSaving(true);
    try {
      await apiPost(
        "/api/employee/change-password",
        { currentPassword, newPassword },
        token ?? undefined
      );
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPwError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  }

  const upcoming = appointments.filter(
    (a) => new Date(a.datetime) >= new Date() && a.status !== "cancelled"
  );
  const past = appointments.filter((a) => new Date(a.datetime) < new Date());

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit",
    });
  }

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      requested: "badge-pending", confirmed: "badge-confirmed",
      cancelled: "badge-cancelled", completed: "badge-completed",
    };
    return map[status.toLowerCase()] ?? "badge-pending";
  }

  function timeOffBadge(status: string) {
    const map: Record<string, string> = {
      pending: "badge-pending", approved: "badge-confirmed", denied: "badge-cancelled",
    };
    return map[status] ?? "badge-pending";
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Staff Portal</p>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">{user?.email}</p>
        </div>
        <button className="btn-outline" onClick={handleLogout}>Sign Out</button>
      </div>

      {/* Stat Cards */}
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

      {/* Tabs */}
      <div className="tab-row">
        <button className={`tab-btn ${tab === "schedule" ? "tab-active" : ""}`} onClick={() => setTab("schedule")}>
          My Schedule
        </button>
        <button className={`tab-btn ${tab === "timeoff" ? "tab-active" : ""}`} onClick={() => setTab("timeoff")}>
          Time Off
        </button>
        <button className={`tab-btn ${tab === "profile" ? "tab-active" : ""}`} onClick={() => setTab("profile")}>
          My Profile
        </button>
      </div>

      {error && <p className="dashboard-error">{error}</p>}

      {/* ── SCHEDULE TAB ── */}
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
                          <p className="appt-datetime">{formatDate(a.datetime)} &middot; {formatTime(a.datetime)}</p>
                          {a.customer_name && <p className="appt-client">{a.customer_name}</p>}
                          {a.customer_phone && (
                            <p className="appt-client-sub">
                              <a href={`tel:${a.customer_phone}`}>{a.customer_phone}</a>
                            </p>
                          )}
                        </div>
                        <span className={`badge ${statusBadge(a.status)}`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {past.length > 0 && (
                <>
                  <p className="section-label" style={{ marginTop: "2rem" }}>Past</p>
                  <div className="appt-list">
                    {past.slice(0, 10).map((a) => (
                      <div key={a.id} className="appt-card appt-card-past">
                        <div className="appt-main">
                          <p className="appt-service">{a.service_name}</p>
                          <p className="appt-datetime">{formatDate(a.datetime)} &middot; {formatTime(a.datetime)}</p>
                          {a.customer_name && <p className="appt-client">{a.customer_name}</p>}
                        </div>
                        <span className={`badge ${statusBadge(a.status)}`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── TIME OFF TAB ── */}
      {tab === "timeoff" && (
        <div className="dashboard-section">
          <p className="section-label">Request Time Off</p>
          <form className="timeoff-form" onSubmit={handleTimeOffSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="to-start">Start Date</label>
                <input id="to-start" className="form-input" type="date" value={toStartDate} onChange={(e) => setToStartDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="to-end">End Date</label>
                <input id="to-end" className="form-input" type="date" value={toEndDate} onChange={(e) => setToEndDate(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="to-note">Note (optional)</label>
              <textarea id="to-note" className="form-textarea" placeholder="Any details for the manager…" value={toNote} onChange={(e) => setToNote(e.target.value)} />
            </div>
            <button className="btn-primary" type="submit" disabled={toSubmitting}>
              {toSubmitting ? "Submitting…" : "Submit Request"}
            </button>
            {toSuccess && <p className="form-success">Request submitted! Your manager will review it.</p>}
          </form>

          {timeOffRequests.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: "2rem" }}>My Requests</p>
              <div className="appt-list">
                {timeOffRequests.map((r) => (
                  <div key={r.id} className="appt-card">
                    <div className="appt-main">
                      <p className="appt-service">
                        {formatDate(r.start_date)}
                        {r.start_date !== r.end_date && ` — ${formatDate(r.end_date)}`}
                      </p>
                      {r.note && <p className="appt-client">{r.note}</p>}
                      <p className="appt-datetime">Submitted {formatDate(r.created_at)}</p>
                    </div>
                    <span className={`badge ${timeOffBadge(r.status)}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── PROFILE TAB ── */}
      {tab === "profile" && (
        <div className="dashboard-section">

          {/* Personal Info */}
          <p className="section-label">Personal Information</p>
          <form className="timeoff-form" onSubmit={handleProfileSave}>
            <div className="form-group">
              <label className="form-label" htmlFor="p-email">Email</label>
              <input
                id="p-email"
                className="form-input"
                type="email"
                value={profile.email}
                disabled
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              />
              <p style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
                Contact your manager to change your login email.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="p-name">Display Name</label>
              <input
                id="p-name"
                className="form-input"
                type="text"
                placeholder="How your name appears on bookings"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="p-phone">Phone Number</label>
              <input
                id="p-phone"
                className="form-input"
                type="tel"
                placeholder="(425) 555-0100"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="p-address">Address</label>
              <input
                id="p-address"
                className="form-input"
                type="text"
                placeholder="123 Main St, Everett, WA 98204"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={profileSaving}>
              {profileSaving ? "Saving…" : "Save Changes"}
            </button>
            {profileSuccess && <p className="form-success">Profile updated successfully!</p>}
            {profileError && <p className="dashboard-error" style={{ marginTop: "10px" }}>{profileError}</p>}
          </form>

          {/* Change Password */}
          <p className="section-label" style={{ marginTop: "2rem" }}>Change Password</p>
          <form className="timeoff-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label" htmlFor="pw-current">Current Password</label>
              <input id="pw-current" className="form-input" type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="pw-new">New Password</label>
                <input id="pw-new" className="form-input" type="password" placeholder="Min. 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="pw-confirm">Confirm Password</label>
                <input id="pw-confirm" className="form-input" type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={pwSaving}>
              {pwSaving ? "Updating…" : "Update Password"}
            </button>
            {pwSuccess && <p className="form-success">Password updated! Use your new password next time you log in.</p>}
            {pwError && <p className="dashboard-error" style={{ marginTop: "10px" }}>{pwError}</p>}
          </form>

        </div>
      )}
    </div>
  );
}
