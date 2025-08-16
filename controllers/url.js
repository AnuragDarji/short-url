// const shortid = require("shortid");
const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
  const body = req.body;
  if (!body) return res.status(400).json({ error: "url is required" });
  const shortID = nanoid(5);

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistroy: [],
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

module.exports = { handleGenerateNewShortUrl, handleGetAnalytics };
