const express = require("express");
const {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
  handleUserAnalytics,
} = require("../controllers/url");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/",authMiddleware, handleGenerateNewShortUrl);

router.get("/analytics/:shortId",authMiddleware, handleGetAnalytics);

router.get("/analytics/user/all", authMiddleware, handleUserAnalytics);

module.exports = router;
