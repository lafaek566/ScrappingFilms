import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import FilmList from "../components/FilmList";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import FilterForm from "../components/FilterForm";

function Home() {
  const [films, setFilms] = useState([]);
  const [loadingFilms, setLoadingFilms] = useState(true);
  const [errorFilms, setErrorFilms] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "", year: "" }); // Contoh filter tambahan

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

  // Filter films berdasarkan searchTerm dan filters
  const filteredFilms = useMemo(() => {
    return films.filter((film) => {
      const matchesSearch =
        film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        film.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre = filters.genre ? film.genre === filters.genre : true;

      const matchesYear = filters.year
        ? String(film.year) === filters.year
        : true;

      return matchesSearch && matchesGenre && matchesYear;
    });
  }, [films, searchTerm, filters]);

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
          {!loadingFilms && !errorFilms && filteredFilms.length > 0 && (
            <Hero films={filteredFilms} />
          )}
        </div>
      </div>

      {/* FilterForm dengan onChange filter */}
      <FilterForm filters={filters} setFilters={setFilters} />

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
          <FilmList films={filteredFilms} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
