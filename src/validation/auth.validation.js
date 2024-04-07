import { z } from "zod";

const signupHomeOwnerSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string().email({ required_error: "Email is required" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, { required_error: "password must be at least 6 characters" }),
  }),
});

const singinSchema = z.object({
  body: z.object({
    email: z.string().email({
      required_error: "email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});
const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: z.string().email({
        required_error: "Email is required and must be in a valid format",
      }),
      newPassword: z.string().min(6, {
        required_error: "New password must be at least 6 characters long",
      }),
      confirmPassword: z.string().min(6, {
        required_error: "Confirm password must be at least 6 characters long",
      }),
    })
    .refine(
      (body) => {
        const isMatch = body.newPassword === body.confirmPassword;
        return isMatch;
      },
      {
        message: "New Password and Confirm Password does not match",
      }
    ),
});

const authValidation = {
  signupHomeOwnerSchema,
  singinSchema,
  forgotPasswordSchema,
};

export default authValidation;
