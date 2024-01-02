import { z } from "zod";

const signupSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string().email({ required_error: "Email is required" }),
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
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

const authValidation = {
  signupSchema,
  singinSchema,
};

export default authValidation;
