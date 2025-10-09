import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ENV } from "../lib/env.js"; // optional if you want centralized ENV
// OR you can directly use process.env.ARCJET_KEY

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    // 🛡️ Protect from common attacks (SQLi, XSS, etc.)
    shield({ mode: "LIVE" }),

    // 🤖 Bot Detection
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // Allow Google, Bing, etc.
    }),

    // 🚦 Rate Limiting (token bucket)
    tokenBucket({
      mode: "LIVE",
      refillRate: 100, // 5 tokens per interval
      interval: 60, // every 10 seconds
      capacity: 50, // max tokens in bucket
    }),
  ],
});

export default aj;
