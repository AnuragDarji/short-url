const express = require("express");
const cors = require("cors");
const urlRoute = require("../routes/url"); // Adjusted path because we're inside /api
const { connectToMongoDB } = require("../connect");
const URL = require("../models/url");
require("dotenv").config();

const mongourl = process.env.MONGO_URL;
const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: "*", // Change to your frontend URL in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Routes
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistroy: { timestamp: Date.now() } } }
  );

  if (!entry) {
    return res.status(404).send("URL not found");
  }

  res.redirect(entry.redirectURL);
});

// ✅ Connect to MongoDB only once
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToMongoDB(mongourl);
    isConnected = true;
    console.log("MongoDB connected");
  }
  next();
});

// ✅ Export as Vercel handler
module.exports = app;
