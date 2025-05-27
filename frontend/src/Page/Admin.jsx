import React, { useState, useRef, useEffect } from "react";

const initialFormState = {
  title: "",
  original_url: "",
  proxy_url: "",
  poster_url: "",
  thumbnail_url: "",
  rating: "",
  quality: "",
  trailer_url: "",
  country: "",
  artists: "",
  director: "",
};

export default function Admin() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isResizing = useRef(false);

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/films");
      if (!res.ok) throw new Error("Gagal mengambil data film");
      const data = await res.json();
      setFilms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const startResizing = () => {
    isResizing.current = true;
  };
  const stopResizing = () => {
    isResizing.current = false;
  };
  const resize = (e) => {
    if (isResizing.current) {
      const newWidth = Math.min(Math.max(e.clientX, 150), 500);
      setSidebarWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3000/api/films/${editId}`
      : `http://localhost:3000/api/films`;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal menyimpan data");
      }

      setForm(initialFormState);
      setEditId(null);
      fetchFilms();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (film) => {
    setEditId(film.id);
    setForm({ ...film });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus film ini?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/films/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal menghapus film");
      }

      fetchFilms();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredFilms = films.filter((film) =>
    film.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white select-none">
      {/* Sidebar */}
      <aside
        className="bg-gray-800 p-6 overflow-y-auto"
        style={{
          width: sidebarWidth,
          minWidth: 150,
          maxWidth: 500,
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">🎬 Admin CMS</h2>
        <nav>
          <ul className="space-y-4">
            <li className="hover:text-yellow-400 cursor-pointer">Dashboard</li>
            <li className="hover:text-yellow-400 cursor-pointer font-semibold">
              Kelola Film
            </li>
            <li
              className="hover:text-yellow-400 cursor-pointer"
              onClick={() => (window.location.href = "/admin/banner")}
            >
              Kelola Banner
            </li>
            <li className="hover:text-yellow-400 cursor-pointer">Logout</li>
            <li
              className="hover:text-yellow-400 cursor-pointer"
              onClick={() => (window.location.href = "/admin/scrape")}
            >
              Scrape Otomatis
            </li>
          </ul>
        </nav>
      </aside>

      {/* Drag handle */}
      <div
        onMouseDown={startResizing}
        className="bg-gray-600 cursor-col-resize fixed top-0 bottom-0"
        style={{
          left: sidebarWidth - 4,
          width: 8,
          zIndex: 50,
          position: "fixed",
        }}
        title="Seret untuk mengubah ukuran sidebar"
      ></div>

      {/* Main Content */}
      <main
        className="flex-1 p-6 overflow-y-auto"
        style={{ marginLeft: sidebarWidth, height: "100vh" }}
      >
        <h1 className="text-3xl font-bold mb-6">Kelola Film</h1>

        {/* Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-10 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Film" : "Tambah Film Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {Object.keys(initialFormState).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  required={key === "title"}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none"
                />
              </div>
            ))}
            <div className="col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded"
              >
                {editId ? "Update" : "Tambah"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialFormState);
                    setEditId(null);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="mb-4 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />
        </div>

        {/* Tabel Film */}
        <div className="overflow-x-auto max-w-7xl mx-auto">
          <table className="min-w-full bg-gray-800 text-sm rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Quality</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Artists</th>
                <th className="px-4 py-2">Director</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Memuat...
                  </td>
                </tr>
              ) : filteredFilms.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Data film tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredFilms.map((film) => (
                  <tr key={film.id} className="border-t border-gray-700">
                    <td className="px-4 py-2">{film.id}</td>
                    <td className="px-4 py-2">{film.title}</td>
                    <td className="px-4 py-2">{film.rating}</td>
                    <td className="px-4 py-2">{film.quality}</td>
                    <td className="px-4 py-2">{film.country}</td>
                    <td className="px-4 py-2">{film.artists}</td>
                    <td className="px-4 py-2">{film.director}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(film)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(film.id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {error && (
            <p className="mt-4 text-red-500 font-semibold text-center">
              Error: {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
