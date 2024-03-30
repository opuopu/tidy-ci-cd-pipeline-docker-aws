import { z } from "zod";

const budgetSchema = z.object({
  body: z
    .object({
      category: z.string({ required_error: "category is required" }),
      amountType: z.string({ required_error: "amount type is required" }),
      amount: z.string({ required_error: "amount is required" }),
    })
    .refine(
      (body) => {
        console.log(body);
      },
      {
        message: "New Password and Confirm Password does not match",
      }
    ),
});
