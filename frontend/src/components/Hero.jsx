import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  return match ? match[1] : null;
};

const getEmbedUrl = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

const getThumbnail = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

function Hero({ films }) {
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const scrollSpeed = 0.5;
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const navigate = useNavigate();

  const startAutoScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId;

    const step = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2 - 1) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    scrollIntervalRef.current = {
      cancel: () => cancelAnimationFrame(animationFrameId),
    };
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      scrollIntervalRef.current.cancel();
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      container.addEventListener("mouseenter", stopAutoScroll);
      container.addEventListener("mouseleave", startAutoScroll);
    }

    return () => {
      if (!isTouchDevice) {
        container.removeEventListener("mouseenter", stopAutoScroll);
        container.removeEventListener("mouseleave", startAutoScroll);
      }
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let isDown = false;
    let startX, scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      stopAutoScroll();
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      if (isDown) {
        isDown = false;
        container.classList.remove("cursor-grabbing");
        startAutoScroll();
      }
    };

    const handleMouseUp = () => {
      if (isDown) {
        isDown = false;
        container.classList.remove("cursor-grabbing");
        startAutoScroll();
      }
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleWatchClick = (film) => {
    if (film.original_url) {
      navigate("/video-player", {
        state: {
          videoUrl: film.original_url,
          ...film,
        },
      });
    } else if (film.proxy_urls && Object.keys(film.proxy_urls).length > 0) {
      const firstQuality = Object.keys(film.proxy_urls)[0];
      navigate("/video-player", {
        state: {
          videoUrl: film.proxy_urls[firstQuality],
          title: film.title,
        },
      });
    } else if (film.proxy_url) {
      navigate("/video-player", {
        state: {
          videoUrl: film.proxy_url,
          ...film,
        },
      });
    }
  };

  const limitedFilms = films.slice(0, 10);
  const displayFilms = [...limitedFilms, ...limitedFilms];

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Film Populer</h2>

      <div className="relative">
        <button
          onClick={() => handleScroll("left")}
          className="flex absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-80 backdrop-blur-sm"
          aria-label="Scroll Left"
        >
          <FaChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth space-x-4 cursor-grab"
        >
          {displayFilms.map((film, idx) => {
            const thumbnail = film.poster || getThumbnail(film.trailer_url);
            if (!thumbnail) return null;
            return (
              <div
                key={idx}
                className="flex-shrink-0 w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 group bg-gray-300"
              >
                <img
                  src={thumbnail}
                  alt={film.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 sm:p-3 text-white text-center font-semibold text-sm sm:text-base">
                  {film.title}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 px-2">
                  <button
                    onClick={() => handleWatchClick(film)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm sm:text-base"
                  >
                    Watch
                  </button>
                  {film.trailer_url && (
                    <button
                      onClick={() => setSelectedTrailer(film.trailer_url)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm sm:text-base"
                    >
                      Trailer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="flex absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-80 backdrop-blur-sm"
          aria-label="Scroll Right"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      {selectedTrailer && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg overflow-hidden max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedTrailer(null)}
              className="absolute top-2 right-2 text-white text-xl bg-red-500 hover:bg-red-600 p-2 rounded"
              aria-label="Close Trailer"
            >
              ✕
            </button>
            <iframe
              src={getEmbedUrl(selectedTrailer)}
              title="Trailer"
              width="100%"
              height="500"
              className="w-full h-[500px]"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
