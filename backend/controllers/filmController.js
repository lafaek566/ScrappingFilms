// import pool from "../config/db.js";

// export const getVideoById = async (req, res) => {
//   try {
//     const id = req.query.id;
//     if (!id) return res.status(400).send("Parameter 'id' dibutuhkan.");

//     // Ambil data film berdasarkan ID
//     const [rows] = await pool.query(
//       "SELECT title, proxy_url FROM films5 WHERE id = ? LIMIT 1",
//       [id]
//     );

//     if (rows.length === 0)
//       return res.status(404).send("Video tidak ditemukan.");

//     const film = rows[0];

//     // Tampilkan video menggunakan proxy_url agar bisa diputar
//     res.send(`
//       <!DOCTYPE html>
//       <html lang="id">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <title>${film.title}</title>
//         <style>
//           body, html {
//             margin: 0; padding: 0; background: #000; height: 100vh; display: flex; justify-content: center; align-items: center;
//           }
//           iframe {
//             width: 80vw; height: 80vh; border: none;
//           }
//         </style>
//       </head>
//       <body>
//         <iframe src="${film.proxy_url}" allowfullscreen></iframe>
//       </body>
//       </html>
//     `);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Terjadi kesalahan server.");
//   }
// };

// https://cloud.hownetwork.xyz/video.php?id=NhAsYzYMBTMnPxMpMR1kaHBNZDkgGxMtHQkoKScEZGAgSnw
// https://cloud.hownetwork.xyz/video.php?id=jSdMwixW%2FXxRj%2F8onE%2F3YxqgRm5222%2BSPYM%2BlDL42BY%3D
