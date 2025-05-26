import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", image_url: "", link: "" });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/banners");
      setBanners(res.data);
    } catch (error) {
      console.error("Failed to fetch banners", error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/banners/${editId}`, form);
      } else {
        await axios.post("http://localhost:3000/api/banners", form);
      }
      setForm({ name: "", image_url: "", link: "" });
      setEditId(null);
      fetchBanners();
    } catch (error) {
      console.error("Failed to save banner", error);
    }
  };

  const handleEdit = (banner) => {
    setEditId(banner.id);
    setForm({
      name: banner.name,
      image_url: banner.image_url,
      link: banner.link,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus banner ini?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/banners/${id}`);
      fetchBanners();
    } catch (error) {
      console.error("Failed to delete banner", error);
    }
  };

  if (loading)
    return (
      <p className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </p>
    );

  return (
    <div className="min-h-screen w-full bg-black text-white p-4">
      <div className="max-w-xl mx-auto">
        {/* Tombol Back */}
        <button
          onClick={() => navigate("/admin")}
          className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-4">Kelola Banner Iklan</h1>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name Banner:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-700 p-2 rounded bg-gray-900 text-white"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Image URL:</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="w-full border border-gray-700 p-2 rounded bg-gray-900 text-white"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Link:</label>
            <input
              type="text"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full border border-gray-700 p-2 rounded bg-gray-900 text-white"
              placeholder="http://..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex-1 min-w-[120px]"
            >
              {editId ? "Update Banner" : "Tambah Banner"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", image_url: "", link: "" });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition flex-1 min-w-[120px]"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {/* Tabel dengan scroll horizontal pada layar kecil */}
        <div className="overflow-x-auto rounded border border-gray-700">
          <table className="w-full table-auto border-collapse border border-gray-700 text-white min-w-[600px]">
            <thead>
              <tr>
                <th className="border border-gray-700 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-700 px-4 py-2 text-left">
                  Gambar
                </th>
                <th className="border border-gray-700 px-4 py-2 text-left">
                  Link
                </th>
                <th className="border border-gray-700 px-4 py-2 text-left">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-800 transition">
                  <td className="border border-gray-700 px-4 py-2">
                    {banner.name}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt="Banner"
                        className="w-24 h-auto rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 truncate max-w-xs">
                    {banner.link || "-"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 space-x-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 text-black transition flex-1 min-w-[70px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white transition flex-1 min-w-[70px]"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBanner;
