import React, { useState } from "react";

const genres = ["Action", "Drama", "Horror", "Comedy", "Sci-Fi"];
const seriesList = ["Stranger Things", "Loki", "The Witcher", "Money Heist"];
const tahunList = ["2021", "2022", "2023", "2024"];
const negaraList = ["Korea", "Amerika", "Jepang", "Indonesia", "Inggris"];

const FilterForm = ({ onFilter }) => {
  const [formData, setFormData] = useState({
    genre: "",
    series: "",
    tahun: "",
    negara: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(formData);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Filter Series 🎥
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-[#1f2937] p-6 rounded-2xl shadow-lg space-y-6 text-white"
        >
          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block mb-1 font-semibold">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Pilih Genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Series */}
          <div>
            <label htmlFor="series" className="block mb-1 font-semibold">
              Series
            </label>
            <select
              id="series"
              name="series"
              value={formData.series}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Pilih Series</option>
              {seriesList.map((series) => (
                <option key={series} value={series}>
                  {series}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun */}
          <div>
            <label htmlFor="tahun" className="block mb-1 font-semibold">
              Tahun
            </label>
            <select
              id="tahun"
              name="tahun"
              value={formData.tahun}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Pilih Tahun</option>
              {tahunList.map((tahun) => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>
          </div>

          {/* Negara */}
          <div>
            <label htmlFor="negara" className="block mb-1 font-semibold">
              Negara
            </label>
            <select
              id="negara"
              name="negara"
              value={formData.negara}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Pilih Negara</option>
              {negaraList.map((negara) => (
                <option key={negara} value={negara}>
                  {negara}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            🔍 Cari
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilterForm;
