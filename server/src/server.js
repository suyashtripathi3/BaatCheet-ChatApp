import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // req.body

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
