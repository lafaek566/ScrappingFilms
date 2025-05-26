import pool from "../config/db.js";
import { updateVideoUrls } from "../grabber/grabber.js";

export const scrapeFilms = async (req, res) => {
  try {
    await updateVideoUrls();
    res.status(200).json({ message: "Scraping selesai!" });
  } catch (error) {
    console.error("❌ Gagal scraping:", error.message);
    res.status(500).json({ message: "Scraping gagal", error: error.message });
  }
};

export const createFilm = async (req, res) => {
  const {
    title,
    original_url,
    proxy_url,
    poster_url,
    thumbnail_url,
    rating,
    quality,
    trailer_url,
    country,
    artists,
    director,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO films5 
      (title, original_url, proxy_url, poster_url, thumbnail_url, rating, quality, trailer_url, country, artists, director)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        original_url,
        proxy_url,
        poster_url,
        thumbnail_url,
        rating,
        quality,
        trailer_url,
        country,
        artists,
        director,
      ]
    );

    res
      .status(201)
      .json({ message: "Film berhasil ditambahkan", id: result.insertId });
  } catch (error) {
    console.error("❌ Gagal tambah film:", error.message);
    res
      .status(500)
      .json({ message: "Gagal tambah film", error: error.message });
  }
};

export const getAllFilms = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM films5 ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Gagal mengambil film:", error.message);
    res
      .status(500)
      .json({ message: "Gagal mengambil film", error: error.message });
  }
};

export const getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM films5 WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Film tidak ditemukan" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("❌ Gagal ambil film ID:", error.message);
    res.status(500).json({ message: "Gagal ambil film", error: error.message });
  }
};

// UPDATE film berdasarkan ID
export const updateFilm = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    original_url,
    proxy_url,
    poster_url,
    thumbnail_url,
    rating,
    quality,
    trailer_url,
    country,
    artists,
    director,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE films5 SET 
        title = ?, original_url = ?, proxy_url = ?, poster_url = ?, 
        thumbnail_url = ?, rating = ?, quality = ?, trailer_url = ?, 
        country = ?, artists = ?, director = ? 
      WHERE id = ?`,
      [
        title,
        original_url,
        proxy_url,
        poster_url,
        thumbnail_url,
        rating,
        quality,
        trailer_url,
        country,
        artists,
        director,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Film tidak ditemukan untuk update" });
    }

    res.status(200).json({ message: "Film berhasil diperbarui" });
  } catch (error) {
    console.error("❌ Gagal update film:", error.message);
    res
      .status(500)
      .json({ message: "Gagal update film", error: error.message });
  }
};

// DELETE film berdasarkan ID
export const deleteFilm = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM films5 WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Film tidak ditemukan untuk dihapus" });
    }

    res.status(200).json({ message: "Film berhasil dihapus" });
  } catch (error) {
    console.error("❌ Gagal hapus film:", error.message);
    res.status(500).json({ message: "Gagal hapus film", error: error.message });
  }
};
