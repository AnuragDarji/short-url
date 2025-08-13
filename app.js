const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
require("dotenv").config();

const mongourl = process.env.MONGO_URL;
const app = express();

// Connect to MongoDB (will only run on first cold start)
connectToMongoDB(mongourl).then(() => {
  console.log("Mongodb connected");
});

app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistroy: { timestamp: Date.now() } } }
    );
    if (entry) {
      return res.redirect(entry.redirectURL);
    }
    res.status(404).send("Not found");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = app;
