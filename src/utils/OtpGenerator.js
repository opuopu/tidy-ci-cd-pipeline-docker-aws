import OtpGenerator from "otp-generator";
export const generateOtp = () => {
  return OtpGenerator.generate(6);
};
