const express = require("express");
const cors = require("cors");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
require("dotenv").config();

const mongourl = process.env.MONGO_URL;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://short-url-ruby-eight.vercel.app",
  "https://df10swf3-5173.inc1.devtunnels.ms"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

connectToMongoDB(mongourl).then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());
app.use("/url", urlRoute);

app.get("/", (req,res)=>res.status(200).json({msg: "Hello world"}))

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
