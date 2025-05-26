import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [films, setFilms] = useState([]);
  const [confirmation, setConfirmation] = useState(""); // yes or no
  const navigate = useNavigate();

  // Background gradient dinamis: ganti setiap 6 detik
  const [bgIndex, setBgIndex] = useState(0);
  const backgrounds = [
    "from-purple-400 via-pink-500 to-red-500",
    "from-green-400 via-blue-500 to-purple-600",
    "from-yellow-400 via-red-400 to-pink-500",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleScrape = async () => {
    if (confirmation !== "yes" && confirmation !== "no") {
      setMessage("⚠️ Silakan pilih 'yes' atau 'no' terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage("");
    setFilms([]);
    try {
      const res = await axios.post("http://localhost:3000/api/scrape", {
        confirmation,
      });
      setMessage(res.data.message);

      // Ambil data film baik confirmation yes atau no
      const filmsRes = await fetch("http://localhost:3000/api/films");
      if (!filmsRes.ok) {
        throw new Error("Gagal mengambil data film");
      }
      const filmsData = await filmsRes.json();
      setFilms(filmsData);
    } catch (err) {
      setMessage(
        "❌ Scraping gagal: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-lg mx-auto p-6 mt-10 rounded-lg shadow-lg text-gray-900 dark:text-gray-100
        bg-gradient-to-r ${backgrounds[bgIndex]} transition-all duration-1000`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Update Film Scraper
      </h2>

      <p className="mb-6 text-sm leading-relaxed text-gray-100">
        Apakah Anda ingin menjalankan <strong>update film pertama kali</strong>?
        <br />
        <span className="italic opacity-90">
          Pilih <strong>yes</strong> untuk menjalankan scraping otomatis dan
          update data film.
          <br />
          Pilih <strong>no</strong> untuk menampilkan data film lama tanpa
          update.
        </span>
      </p>

      <input
        type="text"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value.toLowerCase())}
        placeholder="Ketik 'yes' atau 'no'"
        disabled={loading}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-white bg-opacity-20 border-white placeholder-white placeholder-opacity-70 text-white"
      />

      <button
        onClick={handleScrape}
        disabled={loading}
        className={`w-full py-2 font-semibold rounded-md text-white transition-colors
          ${
            loading
              ? "bg-white bg-opacity-40 cursor-not-allowed"
              : "bg-white bg-opacity-80 hover:bg-opacity-100"
          }`}
      >
        {loading ? "Memproses..." : "Mulai Scraping Film"}
      </button>

      {message && (
        <p
          className={`mt-5 px-4 py-3 rounded-md text-center ${
            message.toLowerCase().includes("gagal")
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400"
              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
          }`}
        >
          {message}
        </p>
      )}

      {films.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center text-white">
            Daftar Film
          </h3>
          <ul className="max-h-64 overflow-y-auto border border-white border-opacity-40 rounded-md divide-y divide-white divide-opacity-30">
            {films.map((film) => (
              <li
                key={film.id}
                className="flex justify-between px-4 py-3 hover:bg-white hover:bg-opacity-20 cursor-pointer transition-colors text-white"
              >
                <span className="font-medium">{film.title}</span>
                <span className="opacity-80">{film.year}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/admin")}
            className="mt-6 w-full bg-white bg-opacity-80 text-gray-900 py-2 rounded-md hover:bg-opacity-100 transition-colors font-semibold"
          >
            Kembali ke Admin
          </button>
        </div>
      )}
    </div>
  );
}
