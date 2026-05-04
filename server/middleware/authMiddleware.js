const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // 🔍 Debug: check header
    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Expect format: Bearer <token>
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    // 🔍 Debug: check token
    console.log("TOKEN:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 Debug: decoded payload
    console.log("DECODED:", decoded);

    // ✅ Normalize user id
    req.user = {
      id: decoded.id || decoded._id,
    };

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid token",
      error: err.message, // helpful during debugging
    });
  }
};