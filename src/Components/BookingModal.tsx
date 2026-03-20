import { useEffect, useRef, useState } from "react";
import { apiGet, apiPost } from "../api/client";

interface Service {
  id: string;
  name: string;
  category: string;
  base_price_cents: number;
}

interface Stylist {
  id: string;
  email: string;
  display_name: string | null;
}

interface BookingModalProps {
  onClose: () => void;
}

type Step = "stylist" | "service" | "datetime" | "contact" | "confirm";

const SALON_HOURS: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: null,
  2: { open: 10, close: 19 },
  3: { open: 10, close: 19 },
  4: { open: 10, close: 19 },
  5: { open: 9, close: 18 },
  6: { open: 9, close: 17 },
};

function generateTimeSlots(open: number, close: number): string[] {
  const slots: string[] = [];
  for (let h = open; h < close; h++) {
    slots.push(`${h}:00`);
    if (h * 60 + 30 < close * 60) slots.push(`${h}:30`);
  }
  return slots;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export default function BookingModal({ onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>("stylist");
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    const first = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)[0];
    first?.focus();
    return () => {
      previousFocus.current?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const first = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)[0];
    first?.focus();
  }, [step]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [svcData, staffData] = await Promise.all([
          apiGet<Service[]>("/api/services"),
          apiGet<{ ok: boolean; staff: Stylist[] }>("/api/staff"),
        ]);
        setServices(svcData ?? []);
        setStylists(staffData.staff ?? []);
      } catch {
        setError("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split("T")[0];
    apiGet<{ ok: boolean; booked: string[] }>(
      `/api/appointments/booked?date=${dateStr}`,
    )
      .then((data) => setBookedTimes(data.booked ?? []))
      .catch(() => setBookedTimes([]));
  }, [selectedDate]);

  const servicesByCategory = services.reduce<Record<string, Service[]>>(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {},
  );

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  function prevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  }

  function isDateSelectable(day: number): boolean {
    const d = new Date(calYear, calMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      return false;
    return SALON_HOURS[d.getDay()] !== null;
  }

  const timeSlots = selectedDate
    ? (() => {
        const hours = SALON_HOURS[selectedDate.getDay()];
        return hours ? generateTimeSlots(hours.open, hours.close) : [];
      })()
    : [];

  const availableTimeSlots = timeSlots.filter((t) => {
    const [h, m] = t.split(":").map(Number);
    const slotDate = new Date(selectedDate!);
    slotDate.setHours(h, m, 0, 0);
    const slotMs = slotDate.getTime();
    return !bookedTimes.some((b) => {
      const bookedMs = new Date(b).getTime();
      return Math.abs(slotMs - bookedMs) < 60 * 60 * 1000;
    });
  });

  async function handleSubmit() {
    if (
      !selectedStylist ||
      !selectedService ||
      !selectedDate ||
      !selectedTime ||
      !name.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const [h, m] = selectedTime.split(":").map(Number);
      const dt = new Date(selectedDate);
      dt.setHours(h, m, 0, 0);

      const res = await apiPost<{
        ok: boolean;
        appointment?: { id: string };
        error?: string;
      }>("/api/appointments", {
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        serviceId: selectedService.id,
        hairdresserId: selectedStylist.id,
        datetime: dt.toISOString(),
      });

      if (!res.ok) throw new Error(res.error || "Booking failed");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (success) {
    return (
      <div
        className="modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Booking confirmed"
      >
        <div
          ref={modalRef}
          className="modal booking-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="modal-title">You're booked!</h2>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="modal-body booking-success">
            <div className="booking-success-icon" aria-hidden="true">
              ✓
            </div>
            <p className="booking-success-title">Request received</p>
            <div className="booking-summary">
              <div className="booking-summary-row">
                <span>Stylist</span>
                <span>
                  {selectedStylist?.display_name || selectedStylist?.email}
                </span>
              </div>
              <div className="booking-summary-row">
                <span>Service</span>
                <span>{selectedService?.name}</span>
              </div>
              <div className="booking-summary-row">
                <span>Date</span>
                <span>
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="booking-summary-row">
                <span>Time</span>
                <span>{selectedTime ? formatTime(selectedTime) : ""}</span>
              </div>
            </div>
            <p className="booking-note">
              We'll follow up to confirm your appointment. Questions? Call{" "}
              <strong>425-353-1244</strong>.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Book an appointment"
    >
      <div
        ref={modalRef}
        className="modal booking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            Book Appointment
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close booking modal"
          >
            ×
          </button>
        </div>

        {/* Progress */}
        <nav aria-label="Booking steps">
          <div className="booking-progress">
            {(["stylist", "service", "datetime", "contact"] as Step[]).map(
              (s, i) => (
                <div
                  key={s}
                  className={`booking-step ${step === s ? "active" : ""} ${
                    ["stylist", "service", "datetime", "contact"].indexOf(
                      step,
                    ) > i
                      ? "done"
                      : ""
                  }`}
                  aria-current={step === s ? "step" : undefined}
                >
                  <span className="booking-step-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="booking-step-label">
                    {s === "datetime"
                      ? "Date & Time"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                </div>
              ),
            )}
          </div>
        </nav>

        <div className="modal-body">
          {error && (
            <p className="booking-error" role="alert">
              {error}
            </p>
          )}

          {/* ── STEP 1: STYLIST ── */}
          {step === "stylist" && (
            <div className="booking-section">
              <p className="booking-section-title" id="step-title">
                Choose your stylist
              </p>
              {loading ? (
                <p className="booking-loading" aria-live="polite">
                  Loading…
                </p>
              ) : (
                <div
                  className="stylist-grid"
                  role="group"
                  aria-labelledby="step-title"
                >
                  <button
                    className={`stylist-card ${selectedStylist?.id === "none" ? "selected" : ""}`}
                    onClick={() =>
                      setSelectedStylist({
                        id: "none",
                        email: "",
                        display_name: "No Preference",
                      })
                    }
                    aria-pressed={selectedStylist?.id === "none"}
                  >
                    <div className="stylist-card-avatar" aria-hidden="true">
                      ✦
                    </div>
                    <p className="stylist-card-name">No Preference</p>
                  </button>
                  {stylists.map((s) => (
                    <button
                      key={s.id}
                      className={`stylist-card ${selectedStylist?.id === s.id ? "selected" : ""}`}
                      onClick={() => setSelectedStylist(s)}
                      aria-pressed={selectedStylist?.id === s.id}
                    >
                      <div className="stylist-card-avatar" aria-hidden="true">
                        {(s.display_name || s.email).charAt(0).toUpperCase()}
                      </div>
                      <p className="stylist-card-name">
                        {s.display_name || s.email.split("@")[0]}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              <div className="booking-nav">
                <div />
                <button
                  className="btn-primary"
                  disabled={!selectedStylist}
                  onClick={() => setStep("service")}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: SERVICE ── */}
          {step === "service" && (
            <div className="booking-section">
              <p className="booking-section-title" id="step-title">
                Choose a service
              </p>
              <div
                className="service-list"
                role="group"
                aria-labelledby="step-title"
              >
                {Object.entries(servicesByCategory).map(([cat, items]) => (
                  <div key={cat} className="service-category">
                    <p className="service-category-label">{cat}</p>
                    {items.map((s) => (
                      <button
                        key={s.id}
                        className={`service-item ${selectedService?.id === s.id ? "selected" : ""}`}
                        onClick={() => setSelectedService(s)}
                        aria-pressed={selectedService?.id === s.id}
                      >
                        <span className="service-item-name">{s.name}</span>
                        <span className="service-item-price">
                          ${(s.base_price_cents / 100).toFixed(0)}+
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="booking-nav">
                <button
                  className="btn-outline"
                  onClick={() => setStep("stylist")}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  disabled={!selectedService}
                  onClick={() => setStep("datetime")}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: DATE & TIME ── */}
          {step === "datetime" && (
            <div className="booking-section">
              <p className="booking-section-title">Pick a date & time</p>
              <div className="calendar" role="group" aria-label="Date picker">
                <div className="calendar-header">
                  <button
                    className="cal-nav"
                    onClick={prevMonth}
                    aria-label="Previous month"
                  >
                    ‹
                  </button>
                  <span className="cal-month" aria-live="polite">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button
                    className="cal-nav"
                    onClick={nextMonth}
                    aria-label="Next month"
                  >
                    ›
                  </button>
                </div>
                <div
                  className="calendar-grid"
                  role="grid"
                  aria-label="Calendar"
                >
                  {DAY_NAMES.map((d) => (
                    <div
                      key={d}
                      className="cal-day-name"
                      role="columnheader"
                      aria-label={d}
                    >
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e${i}`} role="gridcell" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const selectable = isDateSelectable(day);
                    const isSelected =
                      selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === calMonth &&
                      selectedDate?.getFullYear() === calYear;
                    return (
                      <button
                        key={day}
                        role="gridcell"
                        className={`cal-day ${selectable ? "available" : "unavailable"} ${isSelected ? "selected" : ""}`}
                        disabled={!selectable}
                        aria-selected={isSelected}
                        aria-label={`${MONTH_NAMES[calMonth]} ${day}, ${calYear}${!selectable ? ", unavailable" : ""}`}
                        onClick={() => {
                          setSelectedDate(new Date(calYear, calMonth, day));
                          setSelectedTime(null);
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="time-slots">
                  <p className="time-slots-label" id="time-slots-label">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div
                    className="time-slots-grid"
                    role="group"
                    aria-labelledby="time-slots-label"
                  >
                    {availableTimeSlots.length === 0 ? (
                      <p className="booking-loading">
                        No available slots for this day.
                      </p>
                    ) : (
                      availableTimeSlots.map((t) => (
                        <button
                          key={t}
                          className={`time-slot ${selectedTime === t ? "selected" : ""}`}
                          onClick={() => setSelectedTime(t)}
                          aria-pressed={selectedTime === t}
                        >
                          {formatTime(t)}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="booking-nav">
                <button
                  className="btn-outline"
                  onClick={() => setStep("service")}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep("contact")}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: CONTACT ── */}
          {step === "contact" && (
            <div className="booking-section">
              <p className="booking-section-title">Your details</p>
              <div
                className="booking-summary"
                style={{ marginBottom: "1.5rem" }}
              >
                <div className="booking-summary-row">
                  <span>Stylist</span>
                  <span>
                    {selectedStylist?.display_name || selectedStylist?.email}
                  </span>
                </div>
                <div className="booking-summary-row">
                  <span>Service</span>
                  <span>{selectedService?.name}</span>
                </div>
                <div className="booking-summary-row">
                  <span>Date</span>
                  <span>
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="booking-summary-row">
                  <span>Time</span>
                  <span>{selectedTime ? formatTime(selectedTime) : ""}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bk-name">
                  Name *
                </label>
                <input
                  id="bk-name"
                  className="form-input"
                  type="text"
                  placeholder="First & last name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-required="true"
                  autoComplete="name"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="bk-phone">
                  Phone
                </label>
                <input
                  id="bk-phone"
                  className="form-input"
                  type="tel"
                  placeholder="(425) 555-0100"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="bk-email">
                  Email
                </label>
                <input
                  id="bk-email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="booking-nav">
                <button
                  className="btn-outline"
                  onClick={() => setStep("datetime")}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  disabled={!name.trim() || submitting}
                  onClick={handleSubmit}
                  aria-busy={submitting}
                >
                  {submitting ? "Booking…" : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
