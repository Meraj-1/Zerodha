import * as authService from "../services/auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error('Signup controller error:', err.message);
    if (err.message === "User already exists") {
      return res.status(409).json({ 
        message: "User already exists",
        error: "EMAIL_ALREADY_REGISTERED",
        suggestion: "Please login with this email or use a different email address."
      });
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (err.message === "Please login using Google") {
      return res.status(400).json({ message: "Please login using Google" });
    }
    next(err);
  }
};

export const googleCallback = async (req, res, next) => {
  try {
    const token = await authService.googleLogin(req.user);
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  } catch (err) {
    next(err);
  }
};
