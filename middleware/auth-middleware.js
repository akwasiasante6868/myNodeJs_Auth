const jwt = require('jsonwebtoken')
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]

  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access Denied. No token provided. Please login",
    })
  }

  try {
    const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.userInfo = decodeTokenInfo
    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again",
    })
  }
}

module.exports = authMiddleware
