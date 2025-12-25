import * as authService from "../services/auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err) {
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
