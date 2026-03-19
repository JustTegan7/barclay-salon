const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

const addEmployeeSchema = z.object({
  email: z.string().min(1).email(),
  tempPassword: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["HAIRDRESSER", "OWNER"]),
});

const timeOffSchema = z.object({
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  note: z.string().optional(),
});

module.exports = { loginSchema, addEmployeeSchema, timeOffSchema };
