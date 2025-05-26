import db from "../config/db.js";

export const getAllBanners = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM banners ORDER BY created_at DESC"
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ message: "Gagal mengambil data banner" });
  }
};

export const getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query("SELECT * FROM banners WHERE id = ?", [
      id,
    ]);
    if (results.length === 0)
      return res.status(404).json({ message: "Banner tidak ditemukan" });
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching banner:", err);
    res.status(500).json({ message: "Gagal mengambil data banner" });
  }
};

export const createBanner = async (req, res) => {
  const { name, image_url, link } = req.body;
  if (!name || !image_url) {
    return res.status(400).json({ message: "name dan image_url wajib diisi" });
  }

  try {
    const sql = "INSERT INTO banners (name, image_url, link) VALUES (?, ?, ?)";
    const [results] = await db.query(sql, [name, image_url, link || null]);
    res.status(201).json({ id: results.insertId, name, image_url, link });
  } catch (err) {
    console.error("Error creating banner:", err);
    res.status(500).json({ message: "Gagal menambahkan banner" });
  }
};

export const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { name, image_url, link } = req.body;

  try {
    const sql =
      "UPDATE banners SET name = ?, image_url = ?, link = ? WHERE id = ?";
    const [results] = await db.query(sql, [name, image_url, link || null, id]);

    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Banner tidak ditemukan" });

    res.json({ message: "Banner berhasil diperbarui" });
  } catch (err) {
    console.error("Error updating banner:", err);
    res.status(500).json({ message: "Gagal memperbarui banner" });
  }
};

export const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM banners WHERE id = ?";
    const [results] = await db.query(sql, [id]);

    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Banner tidak ditemukan" });

    res.json({ message: "Banner berhasil dihapus" });
  } catch (err) {
    console.error("Error deleting banner:", err);
    res.status(500).json({ message: "Gagal menghapus banner" });
  }
};
