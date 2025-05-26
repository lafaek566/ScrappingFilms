import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

function Search({ films, onSearch }) {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredFilms =
    input.trim() === ""
      ? []
      : films.filter((film) =>
          film.title.toLowerCase().includes(input.toLowerCase())
        );

  const handleSelect = (title) => {
    setInput(title);
    onSearch(title);
    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    onSearch(value);
    setShowDropdown(true);
    setHighlightIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredFilms.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredFilms.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filteredFilms.length) {
        handleSelect(filteredFilms[highlightIndex].title);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div
      className="relative w-full px-4 sm:px-6 lg:px-0 max-w-md sm:max-w-xl md:max-w-3xl mx-auto py-4"
      ref={dropdownRef}
    >
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          type="text"
          placeholder="Cari film..."
          value={input}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#8B0000] text-white placeholder-gray-300 border border-red-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          aria-label="Search films"
          autoComplete="off"
        />
      </div>
      {showDropdown && filteredFilms.length > 0 && (
        <ul
          className="absolute z-50 top-full left-0 right-0 bg-[#5c0000] border border-red-700 rounded-lg max-h-60 overflow-y-auto shadow-lg mt-1"
          role="listbox"
          aria-activedescendant={
            highlightIndex >= 0
              ? `search-item-${filteredFilms[highlightIndex].id}`
              : undefined
          }
        >
          {filteredFilms.map((film, index) => (
            <li
              key={film.id}
              id={`search-item-${film.id}`}
              onClick={() => handleSelect(film.title)}
              className={`cursor-pointer px-4 py-2 transition-colors ${
                index === highlightIndex
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-[#7a0000] text-white"
              }`}
              role="option"
              aria-selected={index === highlightIndex}
              tabIndex={-1}
              onMouseEnter={() => setHighlightIndex(index)}
              onMouseLeave={() => setHighlightIndex(-1)}
            >
              {film.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
