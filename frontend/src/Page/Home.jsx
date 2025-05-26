import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import FilmList from "../components/FilmList";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

function Home() {
  const [films, setFilms] = useState([]);
  const [loadingFilms, setLoadingFilms] = useState(true);
  const [errorFilms, setErrorFilms] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/films")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data film");
        return res.json();
      })
      .then((data) => {
        setFilms(data);
        setLoadingFilms(false);
      })
      .catch((err) => {
        setErrorFilms(err.message);
        setLoadingFilms(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-900 via-red-700 to-red-800 text-white">
      <Navbar />

      {/* Search */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-4">
        <Search films={films} onSearch={setSearchTerm} />
      </div>

      {/* Banner & Hero */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="space-y-6">
          <Banner />
          {!loadingFilms && !errorFilms && films.length > 0 && (
            <Hero films={films} />
          )}
        </div>
      </div>

      {/* Film List Section */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
        {loadingFilms ? (
          <p className="text-center mt-10 text-lg sm:text-xl">
            Loading films...
          </p>
        ) : errorFilms ? (
          <p className="text-center mt-10 text-red-300 font-semibold text-lg sm:text-xl">
            Error: {errorFilms}
          </p>
        ) : (
          <FilmList films={films} searchTerm={searchTerm} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
