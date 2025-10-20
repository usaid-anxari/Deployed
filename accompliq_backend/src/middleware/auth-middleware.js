import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.header("Authorization");

  // 2. Check if token exists
  if (!authHeader) {
    console.error("Authorization header missing");
    return res.status(401).json({
      success: false,
      message: "Authorization header required",
    });
  }

  // 3. Verify Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    console.error("Malformed Authorization header:", authHeader);
    return res.status(401).json({
      success: false,
      message: "Bearer token format required",
    });
  }

  // 4. Extract token
  const token = authHeader.substring(7).trim();

  try {
    // 5. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"], // Explicit algorithm
      clockTolerance: 30, // 30-second leeway for clock skew
    });

    // 6. Validate decoded payload
    if (!decoded?.id) {
      console.error("Token missing user ID:", decoded);
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // 7. Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      // Add other necessary fields
    };

    next();
  } catch (error) {
    // 8. Detailed error handling
    console.error("JWT Verification Failed:", {
      error: error.name,
      message: error.message,
      expiredAt: error.expiredAt,
      currentTime: new Date(),
    });

    const response = { success: false };

    if (error.name === "TokenExpiredError") {
      response.message = "Token expired";
      response.expiredAt = error.expiredAt;
    } else if (error.name === "JsonWebTokenError") {
      response.message = "Invalid token";
    } else {
      response.message = "Authentication failed";
    }

    return res.status(401).json(response);
  }
};

export default authMiddleware;
