import jwt from "jsonwebtoken"

export const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "")

  // Check if no token
  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add user from payload
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is not valid" })
  }
}
