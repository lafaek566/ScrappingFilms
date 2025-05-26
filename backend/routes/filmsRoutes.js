// import express from "express";
// import pool from "../config/db.js";

// const router = express.Router();

// router.get("/films", async (req, res) => {
//   try {
//     const [films] = await pool.query(
//       "SELECT id, title, proxy_url FROM films5 ORDER BY created_at DESC"
//     );

//     res.json(films);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Terjadi kesalahan server." });
//   }
// });

// export default router;
