import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [films, setFilms] = useState([]);
  const navigate = useNavigate();

  const handleScrape = async () => {
    setLoading(true);
    setMessage("");
    setFilms([]);
    try {
      const res = await axios.post("http://localhost:3000/api/scrape");
      setMessage(res.data.message);

      const filmsRes = await fetch("http://localhost:3000/api/films");
      if (!filmsRes.ok) {
        throw new Error("Gagal mengambil data film");
      }
      const filmsData = await filmsRes.json();
      setFilms(filmsData);
    } catch (err) {
      setMessage(
        "Scraping gagal: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-10">
      <button
        onClick={handleScrape}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Mulai Scraping Film"}
      </button>

      {message && <p className="mt-4 text-gray-700">{message}</p>}

      {films.length > 0 && (
        <>
          <ul className="mt-4 text-left max-w-xl mx-auto">
            {films.map((film) => (
              <li key={film.id} className="border-b py-2">
                <strong>{film.title}</strong> - {film.year}
              </li>
            ))}
          </ul>
          {/* Tombol Back */}
          <button
            onClick={() => navigate("/admin")}
            className="mt-6 bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-700"
          >
            Kembali ke Admin
          </button>
        </>
      )}
    </div>
  );
}
