import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username too short")
  .max(20, "Username too long")
  .regex(/^[a-zA-Z0-9_]/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Passowrd must be atleast 6 characters" }),
});
