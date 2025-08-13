const express = require("express");
const cors = require("cors");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
require("dotenv").config();

const mongourl = process.env.MONGO_URL;
const app = express();
const PORT = 8001;

// ✅ Enable CORS
app.use(cors({
  origin: "*", // Change to your frontend URL for production, e.g., "http://localhost:5173"
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
    {
      $push: {
        visitHistroy: { timestamp: Date.now() },
      },
    }
  );
  if (!entry) {
    return res.status(404).send("URL not found");
  }
  res.redirect(entry.redirectURL);
});

// Start server
connectToMongoDB(mongourl).then(() => {
  console.log("Mongodb connected");
  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
});
