import dotenv from "dotenv";

dotenv.config();

const smsEnabled = process.env.SMS_ENABLED === "true";
const required = [
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "REDIS_URL"
];
if (smsEnabled) {
  required.push("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER");
}

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn(`Missing env vars: ${missing.join(", ")}`);
}

export const env = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  redisUrl: process.env.REDIS_URL,
  twilioSid: process.env.TWILIO_ACCOUNT_SID,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioFrom: process.env.TWILIO_FROM_NUMBER,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  smsEnabled,
  emailEnabled: process.env.EMAIL_ENABLED === "true"
};
