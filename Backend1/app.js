import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "mongoose";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import isLoggedIn from "./middleware/isLoggedIn.js";
import { errorHandler } from "./middleware/error.middleware.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://dashboardclone.vercel.app"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Error handling middleware
app.use(errorHandler);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});