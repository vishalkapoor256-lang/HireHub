import crypto from "crypto";

export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashOTP = (otp) => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

export const getOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};