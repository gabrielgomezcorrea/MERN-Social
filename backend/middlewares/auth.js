import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) return res.status(400).json({ msg: "No token provided" });

    if (token.toLowerCase().startsWith("bearer")) {
      token = token.slice(7).trim();
      if (!token) return res.status(400).json({ msg: "Invalid Bearer Token" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
