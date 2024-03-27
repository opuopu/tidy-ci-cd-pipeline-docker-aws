import { z } from "zod";

const paymentIntentSchema = z.object({
  body: z.object({
    number: z.number({ required_error: "Invalid email format" }),
  }),
});
const subscriptionSchema = z.object({
  body: z.object({
    package: z.string({ required_error: "Package is required" }),
    currency: z.string({ required_error: "Currency is required" }),
    transactionId: z.string().optional(),
  }),
});
const paymentValidation = {
  paymentIntentSchema,
  subscriptionSchema,
};
export default paymentValidation;
