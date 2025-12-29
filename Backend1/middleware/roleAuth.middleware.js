import jwt from "jsonwebtoken";

// Role-based access control middleware
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role || 'user';
      
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        return res.status(403).json({ 
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}` 
        });
      }
    } catch (error) {
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

// Admin only access
export const adminOnly = requireRole(['admin']);

// User or Admin access
export const userOrAdmin = requireRole(['user', 'admin']);

// Premium user access (if you add premium role later)
export const premiumAccess = requireRole(['premium', 'admin']);