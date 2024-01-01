import httpStatus from "http-status";
import AppError from "../errors/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { User } from "../models/user.model.js";
const auth = (...userRoles) => {
  return catchAsync(async (req, res, next) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "you are not authorized!");
    }
    const decode = jwt.verify(token, config.jwt_access_secret);
    if (!decode) {
      throw new AppError(httpStatus.UNAUTHORIZED, "invalid token");
    }
    const { role, userId, email, phoneNumber } = decode;
    const isUserExist = User.isUserExist(email);
    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, "user not found");
    }
    if (userRoles && !userRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized ");
    }
    req.user = decode;
    next();
  });
};
export default auth;
