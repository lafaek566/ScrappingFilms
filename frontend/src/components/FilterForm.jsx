import React from "react";

const FilterForm = () => {
  return <div></div>;
};

export default FilterForm;

// import React, { useState, useEffect } from "react";
// import FilterForm from "./FilterForm";

// const MoviesPage = () => {
//   const [filters, setFilters] = useState({ genre: "" });
//   const [movies, setMovies] = useState([]);
//   const [filteredMovies, setFilteredMovies] = useState([]);

//   // Fetch data dari API sekali saat komponen mount
//   useEffect(() => {
//     fetch("http://localhost:3000/api/films")
//       .then((res) => res.json())
//       .then((data) => {
//         setMovies(data);
//         setFilteredMovies(data);
//       })
//       .catch((err) => console.error("Fetch error:", err));
//   }, []);

//   // Filter movies ketika filters.genre berubah
//   useEffect(() => {
//     if (!filters.genre) {
//       setFilteredMovies(movies);
//     } else {
//       const filtered = movies.filter((movie) =>
//         movie.genre
//           .toLowerCase()
//           .split(",")
//           .map((g) => g.trim())
//           .includes(filters.genre.toLowerCase())
//       );
//       setFilteredMovies(filtered);
//     }
//   }, [filters.genre, movies]);

//   return (
//     <div>
//       <FilterForm filters={filters} setFilters={setFilters} />
//       <div className="max-w-3xl mx-auto mt-10 text-white">
//         <h3 className="text-2xl mb-4">
//           {filters.genre ? `Film Genre: ${filters.genre}` : "Semua Film"}
//         </h3>
//         <ul>
//           {filteredMovies.length ? (
//             filteredMovies.map((movie) => (
//               <li
//                 key={movie.id}
//                 className="mb-4 p-4 bg-gray-800 rounded flex items-center space-x-4"
//               >
//                 <img
//                   src={movie.poster_url}
//                   alt={movie.title}
//                   className="w-20 rounded"
//                 />
//                 <div>
//                   <h4 className="font-bold text-lg">{movie.title}</h4>
//                   <p className="text-gray-400 text-sm">{movie.genre}</p>
//                   <p className="text-sm">{movie.synopsis}</p>
//                 </div>
//               </li>
//             ))
//           ) : (
//             <p>Tidak ada film ditemukan.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default MoviesPage;
