import puppeteer from "puppeteer-core";
import pool from "../config/db.js"; // MySQL pool

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

        // Ambil iframe
        let videoUrl = null;
        let proxyUrl = null;

        try {
          await page.waitForSelector("footer.comments iframe", {
            timeout: 30000,
          });
          const outerIframeSrc = await page.$eval(
            "footer.comments iframe",
            (el) => el.src
          );

          console.log("🔗 Iframe luar:", outerIframeSrc);

          const framePage = await browser.newPage();
          await framePage.goto(outerIframeSrc, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });

          await framePage.waitForSelector("iframe", { timeout: 80000 });
          videoUrl = await framePage.$eval("iframe", (el) => el.src);
          console.log("▶️ Iframe dalam (videoUrl):", videoUrl);
          await framePage.close();
        } catch (err) {
          console.log("⚠️ Gagal mengambil iframe dalam:", err.message);
          continue;
        }

        // Ambil id dari videoUrl
        let idParam = null;
        try {
          const urlObj = new URL(videoUrl);
          idParam =
            urlObj.searchParams.get("id") ||
            urlObj.pathname.split("/").filter(Boolean).pop();
        } catch {
          console.log("⚠️ videoUrl tidak valid, lanjut");
          continue;
        }

        proxyUrl = idParam
          ? `https://cloud.hownetwork.xyz/video.php?id=${idParam}`
          : videoUrl;

        console.log("▶️ URL video asli:", videoUrl);
        console.log("🔁 URL proxy:", proxyUrl);

        // Simpan ke database
        const [existing] = await pool.query(
          "SELECT id, original_url, proxy_url FROM films5 WHERE title = ? LIMIT 1",
          [title]
        );

        if (existing.length === 0) {
          await pool.query(
            "INSERT INTO films5 (title, original_url, proxy_url) VALUES (?, ?, ?)",
            [title, videoUrl, proxyUrl]
          );
          console.log("✅ Film disimpan:", title);
        } else {
          const film = existing[0];
          if (film.original_url !== videoUrl || film.proxy_url !== proxyUrl) {
            await pool.query(
              "UPDATE films5 SET original_url = ?, proxy_url = ? WHERE id = ?",
              [videoUrl, proxyUrl, film.id]
            );
            console.log("✅ Film diupdate:", title);
          } else {
            console.log("ℹ️ Film sudah ada dengan URL sama, dilewati:", title);
          }
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

//versi 1
import puppeteer from "puppeteer-core";
import pool from "../config/db.js"; // MySQL pool
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

        // Ambil URL poster
        let posterUrl = null;
        try {
          posterUrl = await page.$eval("article.post img", (img) => img.src);
          console.log("🖼️ Poster URL:", posterUrl);
        } catch {
          console.log("⚠️ Gagal mengambil poster film");
        }

        // Ambil iframe luar
        let videoUrl = null;

        try {
          await page.waitForSelector("footer.comments iframe", {
            timeout: 30000,
          });
          const outerIframeSrc = await page.$eval(
            "footer.comments iframe",
            (el) => el.src
          );

          console.log("🔗 Iframe luar:", outerIframeSrc);

          const framePage = await browser.newPage();
          await framePage.goto(outerIframeSrc, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });

          for (let i = 0; i < 5; i++) {
            try {
              await framePage.waitForSelector("iframe", { timeout: 10000 });
              videoUrl = await framePage.$eval("iframe", (el) => el.src);
              if (videoUrl) {
                console.log(
                  `▶️ Iframe dalam ditemukan di percobaan ke-${i + 1}:`,
                  videoUrl
                );
                break;
              }
            } catch {
              console.log(
                `⚠️ Iframe dalam belum muncul, coba lagi ke-${i + 1}...`
              );
              await new Promise((resolve) => setTimeout(resolve, 3000));
            }
          }

          if (!videoUrl) {
            videoUrl = await framePage.evaluate(() => {
              const scripts = Array.from(document.querySelectorAll("script"));
              for (const script of scripts) {
                const match = script.textContent.match(
                  /https?:\/\/[^\s'"]+\.mp4/
                );
                if (match) return match[0];
              }
              return null;
            });

            if (videoUrl) {
              console.log("▶️ Video URL didapat dari script:", videoUrl);
            }
          }

          if (!videoUrl) throw new Error("Video URL tidak ditemukan");

          await framePage.close();

          const res = await fetch(videoUrl, { method: "HEAD" });
          if (!res.ok) {
            console.log(`⚠️ Video URL tidak valid, status: ${res.status}`);
            continue;
          }
        } catch (err) {
          console.log("⚠️ Gagal mengambil video URL:", err.message);
          continue;
        }

        // Ambil ID untuk proxy
        let idParam = null;
        try {
          const urlObj = new URL(videoUrl);
          idParam =
            urlObj.searchParams.get("id") ||
            urlObj.pathname.split("/").filter(Boolean).pop();
        } catch {
          console.log("⚠️ videoUrl tidak valid, lanjut");
          continue;
        }

        const proxyUrl = idParam
          ? `https://cloud.hownetwork.xyz/video.php?id=${idParam}`
          : videoUrl;

        console.log("▶️ URL video asli:", videoUrl);
        console.log("🔁 URL proxy:", proxyUrl);

        // Simpan ke database
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
            console.log("Insert result:", insertResult);
            console.log("✅ Film disimpan:", title);
          } else {
            const film = existing[0];
            if (
              film.original_url !== videoUrl ||
              film.proxy_url !== proxyUrl ||
              film.poster_url !== posterUrl
            ) {
              const [updateResult] = await pool.query(
                "UPDATE films5 SET original_url = ?, proxy_url = ?, poster_url = ? WHERE id = ?",
                [videoUrl, proxyUrl, posterUrl, film.id]
              );
              console.log("Update result:", updateResult);
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
          await page.waitForSelector("footer.comments iframe", {
            timeout: 30000,
          });

          const outerIframeSrc = await page.$eval(
            "footer.comments iframe",
            (el) => el.src
          );
          console.log("🔗 Iframe luar:", outerIframeSrc);

          const framePage = await browser.newPage();
          await framePage.goto(outerIframeSrc, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });

          // Cari iframe dalam
          for (let i = 0; i < 5; i++) {
            try {
              await framePage.waitForSelector("iframe", { timeout: 10000 });
              videoUrl = await framePage.$eval("iframe", (el) => el.src);
              if (videoUrl) {
                console.log(
                  `▶️ Iframe dalam ditemukan di percobaan ke-${i + 1}:`,
                  videoUrl
                );
                break;
              }
            } catch {
              console.log(
                `⚠️ Iframe dalam belum muncul, coba lagi ke-${i + 1}...`
              );
              await new Promise((resolve) => setTimeout(resolve, 3000));
            }
          }

          // Jika iframe tidak ditemukan, coba cari dari <a> atau <script>
          if (!videoUrl) {
            const linkFromAnchor = await framePage.$$eval("a", (anchors) => {
              for (const a of anchors) {
                if (a.href.includes("cloud.hownetwork.xyz/video.php?id=")) {
                  return a.href;
                }
              }
              return null;
            });

            if (linkFromAnchor) {
              console.log("🔗 Link ditemukan di <a>:", linkFromAnchor);
              videoUrl = linkFromAnchor;
            }
          }

          // Cari dari script
          if (!videoUrl) {
            videoUrl = await framePage.evaluate(() => {
              const scripts = Array.from(document.querySelectorAll("script"));
              for (const script of scripts) {
                const match = script.textContent.match(
                  /https?:\/\/[^\s'"]+\.mp4/
                );
                if (match) return match[0];
              }
              return null;
            });

            if (videoUrl) {
              console.log("▶️ Video URL dari script:", videoUrl);
            }
          }

          if (!videoUrl) throw new Error("Video URL tidak ditemukan");
          await framePage.close();

          // Extract id untuk proxy
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

//final code
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

//versi final
import puppeteer from "puppeteer-core";
import pool from "../config/db.js"; // MySQL pool connection
import fetch from "node-fetch";

export async function updateVideoUrls() {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false, // ganti true untuk produksi
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // sesuaikan path Chrome
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    console.log("🚀 Membuka halaman list film: https://tv4.lk21official.cc/");
    await page.goto("https://tv4.lk21official.cc/", {
      waitUntil: "networkidle2",
      timeout: 90000,
    });

    await page.waitForSelector("article.post a", { timeout: 60000 });

    // Ambil semua link film, filter yang bukan link kategori dll
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

    console.log("✅ Ditemukan", filmLinks.length, "film");

    for (const filmUrl of filmLinks) {
      try {
        console.log("🚀 Membuka halaman detail film:", filmUrl);
        await page.goto(filmUrl, { waitUntil: "networkidle2", timeout: 80000 });

        await page.waitForSelector("h1", { timeout: 80000 });
        const title = await page.$eval("h1", (el) => el.textContent.trim());
        console.log("🎬 Judul film:", title);

        // Filter halaman yang bukan detail film
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
          console.log("⚠️ Halaman ini bukan detail film, dilewati");
          continue;
        }

        // Poster URL
        let posterUrl = null;
        try {
          posterUrl = await page.$eval("article.post img", (img) => img.src);
        } catch {
          console.log("⚠️ Gagal mengambil poster film");
        }

        // Thumbnail URL
        let thumbnailUrl = null;
        try {
          thumbnailUrl = await page.$eval("picture img", (img) => img.src);
        } catch {
          console.log("⚠️ Gagal mengambil thumbnail");
        }

        // Rating (dari class .rating)
        let rating = null;
        try {
          const ratingEl = await page.$(".rating");
          if (ratingEl) {
            rating = await page.evaluate((el) => {
              const raw = el.textContent;
              const matched = raw.match(/[\d.]+/);
              return matched ? matched[0] : null;
            }, ratingEl);
            console.log("⭐ Rating ditemukan:", rating);
          } else {
            console.log("⚠️ Element rating tidak ditemukan");
          }
        } catch (err) {
          console.log("⚠️ Gagal mengambil rating:", err.message);
        }

        // Ambil detail negara, artis, sutradara dari div#movie-detail
        let country = null;
        let artists = [];
        let director = null;

        try {
          const detail = await page.$eval("#movie-detail", (el) => {
            function getTextList(title) {
              const sections = Array.from(el.querySelectorAll("div"));
              for (const section of sections) {
                const h2 = section.querySelector("h2");
                const h3 = section.querySelector("h3");
                if (h2 && h3 && h2.textContent.includes(title)) {
                  // Dapatkan semua <a> dalam <h3> dan ambil teksnya
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

          if (country) console.log("🌍 Negara:", country);
          if (artists.length)
            console.log("🎭 Bintang film:", artists.join(", "));
          if (director) console.log("🎬 Sutradara:", director);
        } catch (err) {
          console.log("⚠️ Gagal mengambil detail tambahan:", err.message);
        }

        // Quality
        let quality = null;
        try {
          const qualityEl = await page.$(".quality-top");
          if (qualityEl) {
            quality = await page.evaluate(
              (el) => el.textContent.trim(),
              qualityEl
            );
          }
        } catch {
          console.log("⚠️ Gagal mengambil kualitas video");
        }

        // Trailer YouTube URL
        let trailerUrl = null;
        try {
          const trailerEl = await page.$('a[href*="youtube.com"]');
          if (trailerEl) {
            trailerUrl = await page.evaluate((el) => el.href, trailerEl);
          }
        } catch {
          console.log("⚠️ Gagal mengambil link trailer");
        }

        // Video URL dan proxy URL dari iframe
        let videoUrl = null;
        let proxyUrl = null;

        try {
          await page.waitForSelector("#player-iframe", { timeout: 30000 });
          const outerIframeSrc = await page.$eval(
            "#player-iframe",
            (el) => el.src
          );

          const framePage = await browser.newPage();
          await framePage.goto(outerIframeSrc, {
            waitUntil: "networkidle2",
            timeout: 60000,
          });

          await framePage.waitForSelector("iframe", { timeout: 10000 });
          videoUrl = await framePage.$eval("iframe", (el) => el.src);
          await framePage.close();

          if (!videoUrl) throw new Error("Iframe dalam tidak memiliki src");

          // Extract ID untuk proxy
          let idParam = null;
          try {
            const urlObj = new URL(videoUrl);
            idParam =
              urlObj.searchParams.get("id") ||
              urlObj.pathname.split("/").filter(Boolean).pop();
          } catch {
            console.log("⚠️ Gagal ekstrak ID, lanjut");
          }

          proxyUrl = idParam
            ? `https://cloud.hownetwork.xyz/video.php?id=${idParam}`
            : videoUrl;

          // Validasi proxy URL dengan HEAD request
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

        // Insert atau update di database
        try {
          const [existing] = await pool.query(
            "SELECT id FROM films5 WHERE title = ? LIMIT 1",
            [title]
          );

          const artistsStr = artists.length > 0 ? artists.join(", ") : null;

          if (existing.length === 0) {
            // Insert
            await pool.query(
              `INSERT INTO films5 (
                title, original_url, proxy_url, poster_url,
                thumbnail_url, rating, quality, trailer_url,
                country, artists, director
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
              ]
            );
            console.log("✅ Data film disimpan ke database");
          } else {
            // Update
            await pool.query(
              `UPDATE films5 SET
                original_url = ?, proxy_url = ?, poster_url = ?,
                thumbnail_url = ?, rating = ?, quality = ?, trailer_url = ?,
                country = ?, artists = ?, director = ?
              WHERE title = ?`,
              [
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
                title,
              ]
            );
            console.log("🔄 Data film diperbarui di database");
          }
        } catch (err) {
          console.log("⚠️ Gagal insert/update database:", err.message);
        }
      } catch (err) {
        console.log("⚠️ Error pada film:", err.message);
      }
    }
  } catch (error) {
    console.log("❌ Error saat scraping:", error.message);
  } finally {
    if (browser) await browser.close();
  }
}
