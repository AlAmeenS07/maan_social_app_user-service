import { redisClient } from "../config/redis";


export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const storeOTP = async (key: string, otp: string) => {
  await redisClient.set(key, otp, {
    EX: 65, 
  });
};


export const verifyOTP = async (key: string, otp: string) => {
  const storedOTP = await redisClient.get(key);

  if (!storedOTP) return null

  return storedOTP === otp;
};


export const deleteOTP = async (key: string) => {
  await redisClient.del(key);
};