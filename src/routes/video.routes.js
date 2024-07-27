const express = require("express");
const { fetchYoutubeVideo } = require("../controller/video.controller.js");
const router = express.Router();

router.post("/videos", fetchYoutubeVideo);

module.exports = router;