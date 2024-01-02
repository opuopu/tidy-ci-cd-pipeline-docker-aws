import catchAsync from "../utils/catchAsync.js";

const validateRequest = (zodSchema) => {
  return catchAsync(async (req, res, next) => {
    await zodSchema.parseAsync({
      body: req.body,
      //   cookie: req.cookie,
    });
    next();
  });
};
export default validateRequest;
