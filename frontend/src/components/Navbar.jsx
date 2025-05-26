import React, { useState } from "react";
import logo from "../assets/logo.png";

function Navbar({ films = [] }) {
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const genres = [...new Set(films.map((film) => film.genre).filter(Boolean))];

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2" aria-label="Home">
          <img src={logo} alt="Logo Filmku" className="h-10 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium relative">
          <a href="#" className="hover:text-red-500">
            Home
          </a>

          {/* Genre Dropdown */}
          <div
            className="relative cursor-pointer hover:text-red-500"
            onMouseEnter={() => setShowGenreDropdown(true)}
            onMouseLeave={() => setShowGenreDropdown(false)}
          >
            Genre
            {showGenreDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 shadow-lg rounded-md py-2 w-40 z-50">
                <ul>
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <li key={genre} className="px-4 py-2 hover:bg-red-600">
                        <a href={`/#genre-${genre.toLowerCase()}`}>{genre}</a>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400">No genres</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <a href="#" className="hover:text-red-500">
            Terbaru
          </a>
          <a href="#" className="hover:text-red-500">
            Kontak
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-4 space-y-2 text-sm font-medium">
          <a href="#" className="block py-2 hover:text-red-500">
            Home
          </a>

          {/* Genre dropdown in mobile */}
          <div>
            <p className="py-2 font-semibold">Genre</p>
            <ul className="ml-4">
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <li key={genre} className="py-1 hover:text-red-500">
                    <a href={`/#genre-${genre.toLowerCase()}`}>{genre}</a>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No genres</li>
              )}
            </ul>
          </div>

          <a href="#" className="block py-2 hover:text-red-500">
            Terbaru
          </a>
          <a href="#" className="block py-2 hover:text-red-500">
            Kontak
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
