import express from "express";
import path from "path";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";

const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// Recommended: Enable trust proxy if behind reverse proxy or Vercel
app.set("trust proxy", true);
app.use(express.json()); // req.body
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
// Production setup
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // ✅ FIXED: No path argument — works in Express 5.1.0
  app.use((_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

// app.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
//   connectDB();
// });

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process with failure
  });
