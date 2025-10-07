import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // ✅ FIXED: No path argument — works in Express 5.1.0
  app.use((_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
