import puppeteer from "puppeteer-core";
import pool from "../config/db.js"; // Koneksi pool MySQL
import fetch from "node-fetch";

export async function updateVideoUrls() {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false, // Ganti true untuk produksi
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    console.log("🚀 Membuka halaman utama...");
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
            !href.includes("/category/") &&
            href !== "#" &&
            !href.startsWith("javascript:")
        )
    );

    console.log(`✅ Ditemukan ${filmLinks.length} film`);

    for (const filmUrl of filmLinks) {
      try {
        console.log("🎬 Membuka:", filmUrl);
        await page.goto(filmUrl, { waitUntil: "networkidle2", timeout: 80000 });

        await page.waitForSelector("h1", { timeout: 80000 });
        const title = await page.$eval("h1", (el) => el.textContent.trim());

        const skipPatterns = [
          "Kumpulan Film",
          "Artist",
          "Sutradara",
          "Translator",
          "Kategori",
          "Genre",
          "Quality",
          "CAM",
          "HD CAM",
          "Streaming Download Film",
          "Nonton Streaming",
          "Box Office Series",
        ];
        if (skipPatterns.some((pattern) => title.includes(pattern))) {
          console.log("⚠️ Halaman bukan detail film, dilewati");
          continue;
        }

        let posterUrl = null;
        try {
          posterUrl = await page.$eval("article.post img", (img) => img.src);
        } catch {}

        let thumbnailUrl = null;
        try {
          thumbnailUrl = await page.$eval("picture img", (img) => img.src);
        } catch {}

        let rating = null;
        try {
          const ratingEl = await page.$(".rating");
          if (ratingEl) {
            rating = await page.evaluate((el) => {
              const raw = el.textContent;
              const match = raw.match(/[\d.]+/);
              return match ? match[0] : null;
            }, ratingEl);
          }
        } catch {}

        let country = null;
        let artists = [];
        let director = null;
        try {
          const detail = await page.$eval("#movie-detail", (el) => {
            function getTextList(title) {
              const divs = Array.from(el.querySelectorAll("div"));
              for (const d of divs) {
                const h2 = d.querySelector("h2");
                const h3 = d.querySelector("h3");
                if (h2 && h3 && h2.textContent.includes(title)) {
                  return Array.from(h3.querySelectorAll("a")).map((a) =>
                    a.textContent.trim()
                  );
                }
              }
              return [];
            }

            return {
              country: getTextList("Negara").join(", "),
              artists: getTextList("Bintang film"),
              director: getTextList("Sutradara").join(", "),
            };
          });

          country = detail.country;
          artists = detail.artists;
          director = detail.director;
        } catch {}

        let quality = null;
        try {
          const qualityEl = await page.$(".quality-top");
          if (qualityEl) {
            quality = await page.evaluate(
              (el) => el.textContent.trim(),
              qualityEl
            );
          }
        } catch {}

        let trailerUrl = null;
        try {
          const trailerEl = await page.$('a[href*="youtube.com"]');
          if (trailerEl) {
            trailerUrl = await page.evaluate((el) => el.href, trailerEl);
          }
        } catch {}

        // --- Ambil genre ---
        let genre = null;
        try {
          genre = await page.evaluate(() => {
            const divs = Array.from(document.querySelectorAll("div"));
            for (const div of divs) {
              const h2 = div.querySelector("h2");
              if (h2 && h2.textContent.includes("Genre")) {
                // Cari semua link <a> dalam div yang sama
                const links = div.querySelectorAll("a");
                if (links.length > 0) {
                  return Array.from(links)
                    .map((a) => a.textContent.trim())
                    .join(", ");
                }
              }
            }
            return null;
          });
        } catch {
          genre = null;
        }

        // --- Ambil IMDb rating dan votes ---
        let imdbRating = null;
        let imdbVotes = null;
        try {
          const imdbData = await page.evaluate(() => {
            const divs = Array.from(document.querySelectorAll("div"));
            for (const div of divs) {
              const h2 = div.querySelector("h2");
              if (h2 && h2.textContent.includes("IMDb")) {
                const h3s = div.querySelectorAll("h3");
                if (h3s.length >= 3) {
                  const rating = h3s[0].textContent.trim();
                  const votesText = h3s[2].textContent.trim(); // contoh: "7314 users" atau "from 7314 users"
                  const votesMatch = votesText.match(/[\d,]+/);
                  const votes = votesMatch
                    ? votesMatch[0].replace(/,/g, "")
                    : null;
                  return { rating, votes };
                }
              }
            }
            return null;
          });

          if (imdbData) {
            imdbRating = imdbData.rating;
            imdbVotes = imdbData.votes;
          }
        } catch {}

        let videoUrl = null;
        let proxyUrl = null;

        try {
          await page.waitForSelector("#player-iframe", { timeout: 30000 });
          const outerSrc = await page.$eval("#player-iframe", (el) => el.src);

          const framePage = await browser.newPage();
          await framePage.goto(outerSrc, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });

          await framePage.waitForSelector("iframe", { timeout: 10000 });
          videoUrl = await framePage.$eval("iframe", (el) => el.src);
          await framePage.close();

          if (!videoUrl) throw new Error("Tidak ada src di iframe");

          let idParam = null;
          try {
            const urlObj = new URL(videoUrl);
            idParam =
              urlObj.searchParams.get("id") ||
              urlObj.pathname.split("/").filter(Boolean).pop();
          } catch {}

          proxyUrl = idParam
            ? `https://playeriframe.lol/iframe.php?url=${encodeURIComponent(
                `https://cloud.hownetwork.xyz/video.php?id=${idParam}`
              )}`
            : videoUrl;

          const res = await fetch(proxyUrl, { method: "HEAD" });
          if (!res.ok) {
            console.log("⚠️ Proxy tidak valid:", res.status);
            continue;
          }
        } catch (err) {
          console.log("⚠️ Gagal ambil video:", err.message);
          continue;
        }

        let synopsis = null;
        try {
          synopsis = await page.$eval("blockquote", (el) =>
            el.innerText.trim()
          );
        } catch {}

        try {
          const artistsStr = artists.length > 0 ? artists.join(", ") : null;

          await pool.query(
            `INSERT INTO films5 (
              title, original_url, proxy_url, poster_url,
              thumbnail_url, rating, quality, trailer_url,
              country, artists, director, synopsis,
              genre, imdb_rating, imdb_votes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              original_url = VALUES(original_url),
              proxy_url = VALUES(proxy_url),
              poster_url = VALUES(poster_url),
              thumbnail_url = VALUES(thumbnail_url),
              rating = VALUES(rating),
              quality = VALUES(quality),
              trailer_url = VALUES(trailer_url),
              country = VALUES(country),
              artists = VALUES(artists),
              director = VALUES(director),
              synopsis = VALUES(synopsis),
              genre = VALUES(genre),
              imdb_rating = VALUES(imdb_rating),
              imdb_votes = VALUES(imdb_votes)`,
            [
              title,
              videoUrl,
              proxyUrl,
              posterUrl,
              thumbnailUrl,
              rating,
              quality,
              trailerUrl,
              country,
              artistsStr,
              director,
              synopsis,
              genre,
              imdbRating,
              imdbVotes,
            ]
          );

          console.log("✅ Data disimpan:", title);
        } catch (err) {
          console.log("⚠️ Gagal simpan DB:", err.message);
        }
      } catch (err) {
        console.log("⚠️ Error pada film:", err.message);
      }
    }
  } catch (err) {
    console.log("❌ Gagal scraping:", err.message);
  } finally {
    if (browser) await browser.close();
  }
}
