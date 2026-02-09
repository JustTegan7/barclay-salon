// types.ts
// Shared types for the Vite (React/TS) frontend to match the DB schema

export type UserRole = "ADMIN" | "OWNER" | "HAIRDRESSER" | "CUSTOMER";
export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

/** Matches: users */
export interface User {
  id: string; // UUID
  role: UserRole;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/** Matches: services */
export interface Service {
  id: string; // UUID
  name: string;
  category: string;
  base_price_cents: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/** Matches: appointments */
export interface Appointment {
  id: string; // UUID
  customer_id: string; // UUID
  hairdresser_id: string; // UUID
  service_id: string; // UUID
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  status: AppointmentStatus;
  notes: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/** Matches: availability */
export interface Availability {
  id: string; // UUID
  hairdresser_id: string; // UUID
  day_of_week: number; // 0-6 (Sun-Sat)
  start_minute: number; // 0-1440
  end_minute: number; // 0-1440
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/** Matches: time_off */
export interface TimeOff {
  id: string; // UUID
  hairdresser_id: string; // UUID
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  status: RequestStatus;
  notes: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

/** Matches: paystubs */
export interface Paystub {
  id: string; // UUID
  hairdresser_id: string; // UUID
  file_url: string;
  period_start: string; // YYYY-MM-DD
  period_end: string; // YYYY-MM-DD
  created_at: string; // ISO datetime
}

/** Auth response shape */
export interface AuthToken {
  token: string;
  user: Pick<User, "id" | "role" | "email" | "first_name" | "last_name">;
}

/** Booking availability response */
export interface AvailableSlotsResponse {
  date: string; // YYYY-MM-DD
  hairdresser_id: string;
  service_duration_minutes: number;
  slots: string[]; // ISO datetimes (start times)
}
