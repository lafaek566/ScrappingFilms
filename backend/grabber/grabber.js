//versi 2
import puppeteer from "puppeteer-core";
import pool from "../config/db.js";
import fetch from "node-fetch";

export async function updateVideoUrls() {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    console.log("🚀 Membuka halaman list film: https://tv4.lk21official.cc/");
    await page.goto("https://tv4.lk21official.cc/", {
      waitUntil: "networkidle2",
      timeout: 90000,
    });

    await page.waitForSelector("article.post a", { timeout: 60000 });

    const filmLinks = await page.$$eval("article.post a", (links) =>
      links
        .map((link) => link.href)
        .filter(
          (href) =>
            href &&
            !href.includes("/genre/") &&
            !href.includes("/country/") &&
            !href.includes("/artist/") &&
            !href.includes("/director/") &&
            !href.includes("/translator/") &&
            href !== "#" &&
            !href.startsWith("javascript:")
        )
    );

    console.log("✅ Ditemukan", filmLinks.length, "film");

    for (const filmUrl of filmLinks) {
      try {
        console.log("🚀 Membuka halaman detail film:", filmUrl);
        await page.goto(filmUrl, { waitUntil: "networkidle2", timeout: 80000 });

        await page.waitForSelector("h1", { timeout: 80000 });
        const title = await page.$eval("h1", (el) => el.textContent.trim());
        console.log("Title saja:", title);

        const skipPatterns = [
          "Kumpulan Film",
          "Kumpulan Film Artist",
          "Kumpulan Film Sutradara",
          "Kumpulan Film Translator",
          "Kumpulan Film Kategori",
          "Kumpulan Film Genre",
          "quality",
          "cam",
          "CAM",
        ];

        if (skipPatterns.some((pattern) => title.includes(pattern))) {
          console.log("⚠️ Halaman ini bukan detail film, dilewati");
          continue;
        }

        console.log("🎬 Judul film:", title);

        let posterUrl = null;
        try {
          posterUrl = await page.$eval("article.post img", (img) => img.src);
          console.log("🖼️ Poster URL:", posterUrl);
        } catch {
          console.log("⚠️ Gagal mengambil poster film");
        }

        let videoUrl = null;
        let proxyUrl = null;

        try {
          // Tunggu dan ambil iframe luar
          await page.waitForSelector("#player-iframe", { timeout: 30000 });
          const outerIframeSrc = await page.$eval(
            "#player-iframe",
            (el) => el.src
          );
          console.log("🔗 Iframe luar (langsung):", outerIframeSrc);

          const framePage = await browser.newPage();
          await framePage.goto(outerIframeSrc, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });

          // Ambil iframe dalam dari halaman iframe luar
          await framePage.waitForSelector("iframe", { timeout: 10000 });
          videoUrl = await framePage.$eval("iframe", (el) => el.src);

          if (!videoUrl) throw new Error("Iframe dalam tidak memiliki src");

          console.log("▶️ URL iframe dalam:", videoUrl);
          await framePage.close();

          // Ambil id dari URL video
          let idParam = null;
          try {
            const urlObj = new URL(videoUrl);
            idParam =
              urlObj.searchParams.get("id") ||
              urlObj.pathname.split("/").filter(Boolean).pop();
          } catch {
            console.log("⚠️ Gagal ekstrak ID, lanjut");
            continue;
          }

          proxyUrl = idParam
            ? `https://cloud.hownetwork.xyz/video.php?id=${idParam}`
            : videoUrl;

          const proxyRes = await fetch(proxyUrl, { method: "HEAD" });
          if (!proxyRes.ok) {
            console.log(`⚠️ Proxy URL tidak valid, status: ${proxyRes.status}`);
            continue;
          }

          console.log("▶️ URL video asli:", videoUrl);
          console.log("🔁 URL proxy:", proxyUrl);
        } catch (err) {
          console.log("⚠️ Gagal mengambil video URL:", err.message);
          continue;
        }

        try {
          const [existing] = await pool.query(
            "SELECT id, original_url, proxy_url, poster_url FROM films5 WHERE title = ? LIMIT 1",
            [title]
          );
          console.log("existing rows found:", existing.length);

          if (existing.length === 0) {
            const [insertResult] = await pool.query(
              "INSERT INTO films5 (title, original_url, proxy_url, poster_url) VALUES (?, ?, ?, ?)",
              [title, videoUrl, proxyUrl, posterUrl]
            );
            console.log("✅ Film disimpan:", title);
          } else {
            const film = existing[0];
            if (
              film.original_url !== videoUrl ||
              film.proxy_url !== proxyUrl ||
              film.poster_url !== posterUrl
            ) {
              await pool.query(
                "UPDATE films5 SET original_url = ?, proxy_url = ?, poster_url = ? WHERE id = ?",
                [videoUrl, proxyUrl, posterUrl, film.id]
              );
              console.log("✅ Film diupdate:", title);
            } else {
              console.log(
                "ℹ️ Film sudah ada dengan data yang sama, dilewati:",
                title
              );
            }
          }
        } catch (dbErr) {
          console.error("❌ Database error:", dbErr.message);
        }
      } catch (errDetail) {
        console.error("❌ Gagal update halaman detail:", errDetail.message);
      }
    }
  } catch (error) {
    console.error("❌ Error utama:", error.message);
  } finally {
    if (browser) await browser.close();
  }
}
