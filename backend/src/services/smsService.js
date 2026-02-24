import Twilio from "twilio";
import { env } from "../config/env.js";

const client = env.smsEnabled ? Twilio(env.twilioSid, env.twilioToken) : null;

export const sendSms = async ({ to, body }) => {
  if (!env.smsEnabled) {
    return { sid: "SMS_DISABLED" };
  }
  return client.messages.create({
    to,
    from: env.twilioFrom,
    body
  });
};
