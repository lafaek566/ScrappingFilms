import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaComment,
} from "react-icons/fa";

import Banner from "./Banner";

function VideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    videoUrl = "",
    original_url = "",
    proxy_url = "",
    title = "Video",
    poster_url = location.state?.thumbnailUrl || "",
    description = "",
    country = "",
    director = "",
    artists = "",
    synopsis = "",
    genre = "",
    imdb_rating: imdbRating = "",
    imdb_votes: imdbVotes = "",
  } = location.state || {};

  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleBack = () => navigate(-1);
  const handlePlayClick = () => setShowVideo(true);
  const handleWatchOriginal = () =>
    original_url && window.open(original_url, "_blank");
  const handleWatchProxy = () => proxy_url && window.open(proxy_url, "_blank");

  const isDirectVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      setComments([
        {
          text: comment,
          id: Date.now(),
          reactions: { like: 0, haha: 0, angry: 0 },
        },
        ...comments,
      ]);
      setComment("");
    }
  };

  const handleReact = (commentId, type) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              reactions: {
                ...c.reactions,
                [type]: c.reactions[type] + 1,
              },
            }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 flex flex-col items-center relative">
      <div>
        <Banner />
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded shadow-lg transition"
      >
        <FaArrowLeft /> Kembali
      </motion.button>

      <div className="w-full max-w-5xl mt-24 md:mt-20 px-2">
        <motion.div
          className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 mb-6 shadow-xl cursor-pointer group"
          onClick={!showVideo ? handlePlayClick : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {showVideo ? (
            isDirectVideo(videoUrl) ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                poster={poster_url || undefined}
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
              />
            ) : (
              <iframe
                src={videoUrl}
                title={title}
                allowFullScreen
                className="w-full h-full"
                frameBorder="0"
                onError={() => setVideoError(true)}
              />
            )
          ) : poster_url ? (
            <img
              src={poster_url}
              alt="Poster"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
              Tidak ada poster tersedia
            </div>
          )}

          {!showVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:bg-opacity-60 transition">
              <FaPlay className="text-white text-6xl animate-pulse" />
            </div>
          )}
        </motion.div>

        {videoError && (
          <div className="text-center text-red-400 mb-4">
            <p>⚠️ Player gagal dimuat.</p>
            <p>
              Silakan gunakan tombol di bawah untuk menonton via Original atau
              Proxy Player.
            </p>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 italic">
          Jika pemutar tidak berfungsi, gunakan tombol alternatif di bawah.
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center mt-4">
          {original_url && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition w-full sm:w-auto"
              onClick={handleWatchOriginal}
            >
              🎬 Tonton Original <FaExternalLinkAlt />
            </motion.button>
          )}
          {proxy_url && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition w-full sm:w-auto"
              onClick={handleWatchProxy}
            >
              🔄 Player 2 <FaExternalLinkAlt />
            </motion.button>
          )}
        </div>

        <div className="mt-10 text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="text-gray-300 max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm text-gray-400 mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <p>
            <strong>Negara:</strong> {country || "-"}
          </p>
          <p>
            <strong>Sutradara:</strong> {director || "-"}
          </p>
          <p>
            <strong>Artis:</strong> {artists || "-"}
          </p>
          <p>
            <strong>Genre:</strong> {genre || "-"}
          </p>
          <p className="sm:col-span-2">
            <strong>Sinopsis:</strong> {synopsis || "-"}
          </p>
          <p>
            <strong>IMDb Rating:</strong> {imdbRating || "-"}
          </p>
          <p>
            <strong>IMDb Votes:</strong> {imdbVotes || "-"}
          </p>
        </div>

        <div className="mt-12 w-full">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaComment /> Komentar
          </h2>

          <form
            onSubmit={handleAddComment}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <input
              type="text"
              placeholder="Tulis komentar kamu..."
              className="flex-1 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            >
              Kirim
            </button>
          </form>

          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md max-w-xl mx-auto relative"
                >
                  <span className="absolute top-2 right-2 text-xs text-gray-400">
                    #{c.id.toString().slice(-4)}
                  </span>
                  <p className="text-white">{c.text}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-300">
                    <button
                      onClick={() => handleReact(c.id, "like")}
                      className="hover:text-blue-400"
                    >
                      👍 {c.reactions.like}
                    </button>
                    <button
                      onClick={() => handleReact(c.id, "haha")}
                      className="hover:text-yellow-400"
                    >
                      😂 {c.reactions.haha}
                    </button>
                    <button
                      onClick={() => handleReact(c.id, "angry")}
                      className="hover:text-red-400"
                    >
                      😠 {c.reactions.angry}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">
              Belum ada komentar. Jadilah yang pertama!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
