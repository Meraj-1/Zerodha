import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import isLoggedIn from "./middleware/isLoggedIn.js";
import { errorHandler } from "./middleware/error.middleware.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import userRoutes from "./routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
    secret: process.env.JWT_SECRET || "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/test", testRoutes);
app.use("/user", userRoutes);

// Add error handling for OAuth
app.use('/auth/google/callback', (err, req, res, next) => {
  console.error('OAuth callback middleware error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  res.redirect('https://dashboardclone.vercel.app/auth?error=detailed_middleware_error');
});

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