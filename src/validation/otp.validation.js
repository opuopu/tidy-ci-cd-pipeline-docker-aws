import { z } from "zod";
const SignupOtpVerificationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string().email({ required_error: "Email is required" }),
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, { required_error: "password must be at least 6 characters" }),
  }),
  otp: z
    .number({
      required_error: "otp is required",
    })
    .min(6, { required_error: "password must be at least 6 characters" }),
});
const forgotPasswordVerifySchema = z.object({
  body: z.object({
    email: z.string().email({ required_error: "Invalid email format" }),
    otp: z
      .string({ required_error: "otp is required" })
      .min(6, { required_error: "OTP must be at least 6 characters long" }),
  }),
});
const otpValidation = {
  SignupOtpVerificationSchema,
  forgotPasswordVerifySchema,
};
export default otpValidation;
