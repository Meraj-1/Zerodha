import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  // If payload is just a string (user ID), convert to object
  const tokenData = typeof payload === 'string' ? { id: payload } : payload;
  
  return jwt.sign(
    tokenData,
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
