import express from "express";
import path from "path";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app } from "./lib/socket.js"; // use only app, not server

const __dirname = path.resolve();

// Connect to DB once
connectDB();

app.set("trust proxy", true);
app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

// Static build for production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.use((_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

// ❌ Don't listen on a port — just export for Vercel
export default app;
