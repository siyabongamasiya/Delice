import { z } from "zod";

export const takeoutOrderSchema = z.object({
  date: z.string().refine((val) => !!val, "Date required"),
  time: z.string().refine((val) => !!val, "Time required"),
  details: z.string().min(10, "Minimum 10 characters"),
});

export const reservationSchema = z.object({
  date: z.string(),
  time: z.string(),
  guestCount: z.number().min(1).max(20),
  details: z.string().min(10),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});
