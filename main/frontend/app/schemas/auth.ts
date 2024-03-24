import { PASSWORD_REGEX } from "@/constants/regex"
import { z } from "zod"

export const SignUpRequestSchema = z.object({
  username: z.string().min(1, "Please fill out this field"),
  email: z.string(),
  password: z
    .string()
    .min(8, "Password needs eight characters or more")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
})

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>

export const VerifyAccountRequestSchema = z.object({
  username: z.string(),
  verification_code: z.string(),
})

export type VerifyAccountRequest = z.infer<typeof VerifyAccountRequestSchema>

export const LoginRequestSchema = z.object({
  username: z.string().min(1, "Please provide a username"),
  password: z.string().min(1, "Please provide a password"),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>
