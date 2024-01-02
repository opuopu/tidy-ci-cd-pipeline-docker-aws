import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const createToken = (jwPayload, Secret, expiresIn) => {
  return jwt.sign(jwPayload, Secret, { expiresIn });
};
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

export const generateRefferalCode = () => {
  return uuidv4().substring(0, 8);
};
