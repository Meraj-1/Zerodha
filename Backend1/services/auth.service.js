import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { connectDB } from "../utils/db.js";

export const signup = async ({ name, email, password, role }) => {
  try {
    await connectDB();
    
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
      isGoogleConnected: false,
      role: role || 'user',
      balance: 0
    });

    const token = generateToken({ id: user._id.toString() });

    return { user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }, token };
  } catch (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
};

export const login = async ({ email, password }) => {
  try {
    await connectDB();
    
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

    const token = generateToken({ id: user._id.toString() });
    return { user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role }, token };
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const googleLogin = async (googleUser) => {
  try {
    await connectDB();
    
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        authProvider: "google",
        avatar: googleUser.avatar,
        isGoogleConnected: true,
        role: 'user',
        balance: 0
      });
    } else {
      // Update existing user with Google connection
      user.googleId = googleUser.googleId;
      user.isGoogleConnected = true;
      user.avatar = googleUser.avatar;
      await user.save();
    }

    return generateToken({ id: user._id.toString() });
  } catch (error) {
    console.error('Google login error:', error.message);
    throw error;
  }
};
