import jwt from "jsonwebtoken";
export const createToken = (jwPayload, Secret, expiresIn) => {
  return jwt.sign(jwPayload, Secret, { expiresIn });
};
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
