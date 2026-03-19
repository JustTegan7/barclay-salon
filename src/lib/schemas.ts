import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Must be a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const addEmployeeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Must be a valid email"),
  tempPassword: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["HAIRDRESSER", "OWNER"]),
});

export const timeOffSchema = z
  .object({
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      return new Date(data.end_date) >= new Date(data.start_date);
    },
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    },
  );

export type LoginInput = z.infer<typeof loginSchema>;
export type AddEmployeeInput = z.infer<typeof addEmployeeSchema>;
export type TimeOffInput = z.infer<typeof timeOffSchema>;
