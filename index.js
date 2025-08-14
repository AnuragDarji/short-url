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

connectToMongoDB(mongourl).then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistroy: { timestamp: Date.now() } } }
  );

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(entry.redirectURL);
});

// Export app for Vercel
module.exports = app;
