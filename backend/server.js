import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);

app.get("/", (req, res) => {
  res.send("Secure Access Gateway API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});