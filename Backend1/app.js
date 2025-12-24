import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connect } from "mongoose";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import isLoggedIn from "./middleware/isLoggedIn.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";

const app = express();

connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.get("/dashboard", isLoggedIn, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

app.get("/", (req, res) => {
  res.send("Server is running on port 8000");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});