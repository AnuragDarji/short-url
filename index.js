const express = require("express");
const cors = require("cors");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
require("dotenv").config();

const mongourl = process.env.MONGO_URL;
const app = express();

// Allowed CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://short-url-ruby-eight.vercel.app",
  "https://df10swf3-5173.inc1.devtunnels.ms",
  "https://shorturl-fawn.vercel.app",
];

// CORS setup with error handling
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Connect to MongoDB with error handling
connectToMongoDB(mongourl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });

app.use(express.json());

// Routes
app.use("/url", urlRoute);
app.use("/api", require("./routes/auth"));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello world" });
});

// Redirect short URL route
app.get("/:shortId", async (req, res, next) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistroy: { timestamp: Date.now() } } }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(entry.redirectURL);
  } catch (err) {
    next(err); // Pass to error handler
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// Export for Vercel
module.exports = app;
// app.listen(8001, () => console.log(`Server started at PORT: 8001`));
