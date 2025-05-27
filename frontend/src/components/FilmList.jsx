import React, { useState } from "react";
import { FaPlay, FaYoutube } from "react-icons/fa";

function FilmList({ films, searchTerm = "" }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedFilmQualities, setSelectedFilmQualities] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [selectedFilmTitle, setSelectedFilmTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const FILMS_PER_PAGE = 18;

  const openTrailer = (url) => {
    setTrailerUrl(url);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerUrl("");
  };

  const openQualityModal = (film) => {
    if (film.proxy_urls && Object.keys(film.proxy_urls).length > 0) {
      setSelectedFilmQualities(film.proxy_urls);
      setSelectedQuality(null);
      setSelectedFilmTitle(film.title || "Film");
      setShowQualityModal(true);
    } else if (film.proxy_url) {
      window.open(film.proxy_url, "_blank", "noopener");
    }
  };

  const closeQualityModal = () => {
    setShowQualityModal(false);
    setSelectedFilmQualities(null);
    setSelectedQuality(null);
    setSelectedFilmTitle("");
  };

  const playSelectedQuality = () => {
    if (selectedQuality && selectedFilmQualities[selectedQuality]) {
      window.open(selectedFilmQualities[selectedQuality], "_blank", "noopener");
      closeQualityModal();
    }
  };

  const normalize = (str) => str.toLowerCase().trim().replace(/\s+/g, " ");

  const filteredFilms = films.filter((film) => {
    if (!searchTerm.trim()) return true;
    const q = normalize(searchTerm);
    const title = film.title ? normalize(film.title) : "";
    const desc = film.description ? normalize(film.description) : "";
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil(filteredFilms.length / FILMS_PER_PAGE);
  const startIndex = (currentPage - 1) * FILMS_PER_PAGE;
  const paginatedFilms = filteredFilms.slice(
    startIndex,
    startIndex + FILMS_PER_PAGE
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="transform scale-[0.95] p-7 max-w-7xl mx-auto bg-gray-900 min-h-screen rounded-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        🎬 Daftar Film
      </h1>

      {filteredFilms.length === 0 ? (
        <p className="text-center text-gray-400">Tidak ada film ditemukan.</p>
      ) : (
        <>
          {/* Grid container */}
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 w-full max-w-screen-xl mx-auto px-4 sm:px-6">
            {paginatedFilms.map((film) => {
              const hasTrailer = !!film.trailer_url;
              const hasFullMovie =
                film.proxy_url ||
                (film.proxy_urls && Object.keys(film.proxy_urls).length > 0);

              return (
                <li
                  key={film.id}
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:scale-[1.05] transition-transform duration-300 relative"
                  title={film.title}
                >
                  {/* Poster container with fixed aspect ratio */}
                  <div className="relative w-full aspect-[2/3] bg-gray-700">
                    {film.poster_url ? (
                      <img
                        src={film.poster_url}
                        alt={film.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full italic text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Buttons overlay bottom - adjusted for responsiveness */}
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap justify-center gap-2">
                      {hasFullMovie && (
                        <button
                          onClick={() => openQualityModal(film)}
                          className="flex items-center justify-center space-x-1 px-3 py-1 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 text-xs min-w-[72px]"
                          aria-label={`Watch full movie: ${film.title}`}
                        >
                          <FaPlay />
                          <span>Watch</span>
                        </button>
                      )}
                      {hasTrailer && (
                        <button
                          onClick={() => openTrailer(film.trailer_url)}
                          className="flex items-center justify-center space-x-1 px-3 py-1 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 text-xs min-w-[72px]"
                          aria-label={`Watch trailer: ${film.title}`}
                        >
                          <FaYoutube />
                          <span>Trailer</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-grow">
                    <h2
                      className="font-semibold text-white text-sm truncate"
                      title={film.title}
                    >
                      {film.title}
                    </h2>
                    <div className="text-gray-300 text-xs mt-1 space-y-0.5 flex-grow">
                      <p>Negara: {film.country || "-"}</p>
                      <p>Sutradara: {film.director || "-"}</p>
                      <p>Artis: {film.artists || "-"}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination */}
          <div className="flex justify-center space-x-2 mt-8 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 rounded text-white disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white hover:bg-blue-500"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 rounded text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal Trailer */}
      {showTrailer && (
        <div
          onClick={closeTrailer}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-label="Trailer modal"
        >
          <div
            className="bg-black rounded-lg overflow-hidden max-w-4xl w-full aspect-video relative"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={trailerUrl.replace("watch?v=", "embed/")}
              title="Trailer"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={closeTrailer}
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              aria-label="Close trailer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modal Quality Selector */}
      {showQualityModal && (
        <div
          onClick={closeQualityModal}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-label="Quality selection modal"
        >
          <div
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-xl mb-4">
              Pilih kualitas untuk "{selectedFilmTitle}"
            </h3>
            <div className="flex flex-col space-y-3 max-h-80 overflow-y-auto">
              {selectedFilmQualities &&
                Object.entries(selectedFilmQualities).map(([quality, url]) => (
                  <label
                    key={quality}
                    className={`flex items-center space-x-3 cursor-pointer rounded p-2 ${
                      selectedQuality === quality
                        ? "bg-blue-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quality"
                      value={quality}
                      checked={selectedQuality === quality}
                      onChange={() => setSelectedQuality(quality)}
                      className="accent-blue-500"
                    />
                    <span className="text-white">{quality}</span>
                  </label>
                ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeQualityModal}
                className="px-4 py-2 bg-gray-700 rounded text-white"
              >
                Batal
              </button>
              <button
                onClick={playSelectedQuality}
                disabled={!selectedQuality}
                className="px-4 py-2 bg-blue-600 rounded text-white disabled:opacity-50"
              >
                Putar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilmList;
