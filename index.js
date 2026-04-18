import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js"; // ✅ was missing
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js"; // ✅ was missing

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ Routes must come AFTER middleware
app.use('/api/auth', authRouter);
app.use("/api/user", userRouter); 
app.use("/api/listings", listingRouter); 

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

// ✅ Fixed the error handler (statusCode and message were not defined)
app.use((err, req, res, next) => {
  const errorStatus = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error!";
  console.error("Backend Error:", errorMessage); // ✅ was `message`, now `errorMessage`

  return res.status(errorStatus).json({
    success: false,
    statusCode: errorStatus, // ✅ was `statusCode` (undefined), now `errorStatus`
    message: errorMessage,
  });
});