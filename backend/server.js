import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import filmsRoutes from "./routes/filmsRoutes.js";
import { updateVideoUrls } from "./grabber/grabber.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", filmsRoutes);

// 🔁 Cron setiap 15 menit
cron.schedule("*/15 * * * *", async () => {
  console.log("[CRON] Mulai update film...");
  try {
    await updateVideoUrls();
  } catch (err) {
    console.error("❌ Cron gagal:", err.message);
  }
});

// 🚀 Update pertama saat server start
(async () => {
  try {
    await updateVideoUrls(); // initial fetch
  } catch (err) {
    console.error("❌ Gagal update pertama:", err.message);
  }
})();

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
