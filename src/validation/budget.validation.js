import dayjs from "dayjs";
import { z } from "zod";

const postBudgetSchema = z.object({
  body: z
    .object({
      category: z.string({ required_error: "category is required" }),
      amountType: z.string({ required_error: "amount type is required" }),
      amount: z.string({ required_error: "amount is required" }),
      month: z.string({ required_error: "amount is required" }),
    })
    .refine(
      (body) => {
        const [year, mon] = body?.month?.split("-");
        console.log(year, mon);
        const checkDigits = mon.length >= 2;
        return checkDigits;
      },
      {
        required_error: "please select valid date",
      }
    ),
});

const budgetValidationSchema = {
  postBudgetSchema,
};
export default budgetValidationSchema;
