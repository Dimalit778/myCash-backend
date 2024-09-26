import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorMiddleware.js";

import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: process.env.PORT || "https://mycash-ra2a-yxco.onrender.com",
    credentials: true,
  })
);

app.set("trust proxy", 1);

// Routes
app.use("/api/users", verifyToken, userRoute);
app.use("/api/auth", authRoute);
app.use("/api/transactions", verifyToken, transactionsRoute);

// Re render Render Service
app.get("/api/renderSite", (req, res) => {
  res.send("renderSite");
});

// Database connection
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB store connected!"))
  .catch((err) => console.log("DB connection error:", err));

// Server configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Connected to backend");
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const static_path = path.resolve(__dirname, "front", "build");
  app.use(express.static(static_path));

  app.get("*", (req, res) => res.sendFile(path.resolve(static_path, "index.html")));
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// Error handling middleware
app.use(errorHandler);
