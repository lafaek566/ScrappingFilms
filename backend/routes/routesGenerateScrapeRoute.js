import express from "express";
import { updateVideoUrls } from "../grabber/grabber.js";

const router = express.Router();

router.post("/scrape", async (req, res) => {
  try {
    await updateVideoUrls();
    res.json({ success: true, message: "Scraping berhasil!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal scraping.",
      error: error.message,
    });
  }
});

export default router;
