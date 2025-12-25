import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const signup = async ({ name, email, password, role }) => {
  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`,
    isGoogleConnected: false
  });

  const token = generateToken(user._id);

  return { user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }, token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.authProvider !== "local") {
    throw new Error("Please login using Google");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);
  return { user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }, token };
};

export const googleLogin = async (googleUser) => {
  let user = await User.findOne({ email: googleUser.email });

  if (!user) {
    user = await User.create({
      name: googleUser.name,
      email: googleUser.email,
      googleId: googleUser.googleId,
      authProvider: "google",
      avatar: googleUser.avatar,
      isGoogleConnected: true
    });
  } else {
    // Update existing user with Google connection
    user.googleId = googleUser.googleId;
    user.isGoogleConnected = true;
    user.avatar = googleUser.avatar;
    await user.save();
  }

  return generateToken(user._id);
};
