import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://mern-estate-client.vercel.app', // your frontend URL
  credentials: true
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("API is running!");
});
app.use('/api/auth', authRouter);
app.use("/api/user", userRouter);
app.use("/api/listings", listingRouter);

// Error Handler
app.use((err, req, res, next) => {
  const errorStatus = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error!";
  console.error("Backend Error:", errorMessage);
  return res.status(errorStatus).json({
    success: false,
    statusCode: errorStatus,
    message: errorMessage,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

export default app;