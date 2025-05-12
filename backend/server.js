import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import bookRoutes from "./routes/books.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const PRIMARY_DB_URI = process.env.MONGODB_URI
const FALLBACK_DB_URI = process.env.MONGODB_URI_FALLBACK || "mongodb://mongodb:27017/bookmanagement"

// Middleware
app.use(cors())
app.use(express.json())

// Middleware to ensure Content-Type is set correctly for all JSON responses
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(body) {
    res.setHeader('Content-Type', 'application/json');
    return originalJson.call(this, body);
  };
  next();
});

// Test endpoint - Add this before MongoDB connection to ensure API is accessible
app.get("/api/test", (req, res) => {
  res.json({ message: "Test endpoint working correctly" });
});

// MongoDB connection with primary and fallback
const connectToDB = async (uri, isFallback = false) => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`Connected to MongoDB ${isFallback ? '(fallback)' : '(primary)'}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection error: ${uri}`, error.message);
    return false;
  }
};

// Connect with retry and fallback
const connectWithRetryAndFallback = async () => {
  console.log('Attempting MongoDB connection...');
  
  // Try primary connection
  const isPrimaryConnected = await connectToDB(PRIMARY_DB_URI);
  
  // If primary fails, try fallback
  if (!isPrimaryConnected) {
    console.log('Primary MongoDB connection failed, trying fallback...');
    const isFallbackConnected = await connectToDB(FALLBACK_DB_URI, true);
    
    if (!isFallbackConnected) {
      console.log('All MongoDB connections failed, retrying in 5 seconds...');
      setTimeout(connectWithRetryAndFallback, 5000);
    }
  }
};

// Start connection process
connectWithRetryAndFallback();

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: "Something went wrong!" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
