const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body) return res.status(400).json({ error: "url is required" });
  const shortID = shortid(5);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistroy: [],
    userId: req.user.id,
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistroy.length,
    analytics: result.visitHistroy,
  });
}

async function handleUserAnalytics(req, res) {
  try {
    console.log(req.user);
    const userId = req.user.id; 


    const urls = await URL.find({ userId });

    const analytics = urls.map((url) => ({
      shortId: url.shortId,
      redirectUrl: url.redirectURL,
      totalClicks: url.visitHistroy.length,
      analytics: url.visitHistroy,
    }));

    res.json({ urls: analytics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleGenerateNewShortUrl, handleGetAnalytics, handleUserAnalytics };
