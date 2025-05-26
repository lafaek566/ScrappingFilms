import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import authRoutes from "./routes/authRoutes.js";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import scrapeGenerateRoutes from "./routes/routesGenerateScrapeRoute.js";
import { updateVideoUrls } from "./grabber/grabber.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api", scrapeRoutes);
app.use("/api", scrapeGenerateRoutes);

// Cron job tetap jalan setiap 15 menit
cron.schedule("*/15 * * * *", async () => {
  console.log("[CRON] Mulai update film...");
  try {
    await updateVideoUrls();
  } catch (err) {
    console.error("❌ Cron gagal:", err.message);
  }
});

// Buat route POST /api/scrape yang menerima pilihan konfirmasi dari frontend
app.post("/api/scrape", async (req, res) => {
  const { confirmation } = req.body; // "yes" atau "no"

  if (confirmation === "yes") {
    try {
      console.log("🚀 Memulai update film pertama kali...");
      await updateVideoUrls();
      res.json({ message: "✅ Update film pertama kali berhasil." });
    } catch (err) {
      console.error("❌ Gagal update pertama:", err.message);
      res.status(500).json({ message: "Gagal update film pertama." });
    }
  } else if (confirmation === "no") {
    console.log("🛑 Update film pertama kali dibatalkan oleh user.");
    res.json({ message: "Update film pertama kali dibatalkan." });
  } else {
    res
      .status(400)
      .json({ message: "Field 'confirmation' harus 'yes' atau 'no'." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
