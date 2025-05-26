import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import readline from "readline";
// import filmsRoutes from "./routes/filmsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import { updateVideoUrls } from "./grabber/grabber.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import scrapeGenerateRoutes from "./routes/routesGenerateScrapeRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api", scrapeRoutes);
app.use("/api", scrapeGenerateRoutes);

// app.use("/api", filmsRoutes);

// 🔁 Cron setiap 15 menit
cron.schedule("*/15 * * * *", async () => {
  console.log("[CRON] Mulai update film...");
  try {
    await updateVideoUrls();
  } catch (err) {
    console.error("❌ Cron gagal:", err.message);
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Apakah ingin menjalankan update film pertama kali? (yes/no) ",
  async (answer) => {
    if (answer.toLowerCase() === "y") {
      try {
        console.log("🚀 Memulai update film pertama kali...");
        await updateVideoUrls();
        console.log("✅ Update pertama selesai!");
      } catch (err) {
        console.error("❌ Gagal update pertama:", err.message);
      }
    } else {
      console.log("🛑 Update film pertama kali dibatalkan.");
    }

    rl.close();

    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    });
  }
);
