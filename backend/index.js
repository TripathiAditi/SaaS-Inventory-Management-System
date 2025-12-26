import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

// Load environment variables
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json()); // parse JSON body


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StockFlow API is running 🚀",
  });
});


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  });
