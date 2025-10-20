import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// Database will be connected on first request, not at startup
import allRoutes from "./Routes/all-routes.js";
import { syncDatabase } from "./db/sync.js";
import http from "http";
import morgan from "morgan";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get CORS origins from the environment variable or default to a safe set
export const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")  // Allow multiple origins
  : ["https://www.accompliq.com", "https://accompliq.com","https://deployed-seven.vercel.app", process.env.CLIENT_URL] || "http://localhost:3000";  // Default for local and production domains
// Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));

// Apply rate-limiting to prevent abuse
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 1000,  // Max requests per 15 minutes
  })
);

// **CORS Middleware with allowed headers**
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is in the allowed list (case-insensitive for robustness)
      if (!origin || CORS_ORIGINS.some(o => o.toLowerCase() === origin.toLowerCase())) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,  // Allow cookies or authorization headers
    allowedHeaders: ["Content-Type", "Authorization", "X-Content-Type-Options", "X-Frame-Options"],  // Add custom headers from frontend
    exposedHeaders: ["Authorization"],  // If needed, expose headers to the client
  })
);

// **Custom Middleware to Force CORS Headers for Specific Origins**
// This ensures that for requests from www.accompliq.com (or other allowed origins),
// the necessary headers are explicitly set. This acts as a backup to the cors middleware.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && CORS_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);  // Force the exact origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, X-Frame-Options');
    res.setHeader('Access-Control-Max-Age', '86400');  // Cache preflight response for 24 hours
    console.log(`Forced CORS headers for origin: ${origin}`);  // Log for debugging
  }
  next();
});

// **Handle Preflight (OPTIONS) Requests Explicitly**
// This ensures OPTIONS requests are handled for all routes, with logging for debugging
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin && CORS_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, X-Frame-Options');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    console.log(`Handled OPTIONS request for origin: ${origin}`);
  }
  res.status(200).end();
});

// Health check route
app.get("/api/health", (req, res) =>
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  })
);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Vercel!' });
});
// Routes
app.use("/api", allRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Server error",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Internal Error",
  });
});

// Initialize database for Vercel (only if explicitly enabled)
if (process.env.SYNC_DB_ON_STARTUP === "true") {
  syncDatabase().catch(error => {
    console.error("Database initialization failed:", error);
  });
}

// For local development only
if (process.env.NODE_ENV !== "production") {
  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;