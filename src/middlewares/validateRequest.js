import catchAsync from "../utils/catchAsync.js";

const validateRequest = async (zodSchema) => {
  return catchAsync(async (req, res, next) => {
    await zodSchema.parseAsync({
      body: req.body,
      //   cookie: req.cookie,
    });
  });
};
export default validateRequest;
