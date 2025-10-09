import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });
    // console.log("Arcjet Decision:", decision);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error:
            "Too Many Requests - Rate limit exceeded. Please try again later.",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot Access Denied" });
      } else {
        return res
          .status(403)
          .json({ error: "Forbidden: Access denied by security policy." });
      }
    }

    if (decision.ip.isHosting()) {
      return res.status(403).json({ error: "Hosting IPs not allowed" });
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed Bot Detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet Middleware Protection Error:", error);
    next();
  }
};
