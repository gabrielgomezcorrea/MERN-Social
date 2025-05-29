import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "../middlewares/auth.js";
import { users, posts } from "../data/index.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

// Config
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// DB
mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("✅ MongoDB connected\n");

    /* console.log("🌱 Seeding the database ...\n");
    Promise.all([User.insertMany(users), Post.insertMany(posts)])
      .then(() => {
        console.log("✅ Seed success");
      })
      .catch((seedErr) => {
        console.error("❌ Seed error:", seedErr.message);
      }); */
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/assets"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Routes
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { createPost } from "./controllers/posts.js";
import postRoutes from "./routes/posts.js";

// With files
app.post("/api/auth/register", [upload.single("picture")], register);
app.post("/api/posts", [verifyToken], createPost);

// Api Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Server
app.listen(port, () => {
  console.log("\n==========================================");
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log("==========================================\n");
});
