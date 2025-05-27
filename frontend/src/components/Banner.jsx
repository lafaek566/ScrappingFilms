import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [visible, setVisible] = useState([true, true]);
  const bannerRef = useRef(null);
  const [bottomSecond, setBottomSecond] = useState("6rem");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/banners")
      .then((res) => setBanners(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (bannerRef.current) {
      const height = bannerRef.current.offsetHeight;
      const gap = 20;
      const bottomValue = height + gap + 16;
      setBottomSecond(`${bottomValue}px`);
    }
  }, [banners]);

  useEffect(() => {
    document.body.style.paddingBottom =
      visible[0] || visible[1] ? "100px" : "0";
    return () => {
      document.body.style.paddingBottom = "0";
    };
  }, [visible]);

  if (banners.length < 3) return null;

  const handleClose = (index) => {
    setVisible((v) => {
      const copy = [...v];
      copy[index] = false;
      return copy;
    });

    setTimeout(() => {
      setVisible((v) => {
        const copy = [...v];
        copy[index] = true;
        return copy;
      });
    }, 10000);
  };

  const firstBanner = banners[0];
  const secondBanner = banners[1];
  const thirdBanner = banners[2];

  return (
    <>
      {/* Banner Landscape Statis */}
      {thirdBanner && (
        <div className="relative w-full bg-yellow-100 py-3 px-4 flex flex-col items-center justify-center shadow-md mb-4 rounded-md max-w-screen-xl mx-auto">
          <button
            onClick={() => {}}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl font-bold"
            aria-label="Close"
          >
            ✕
          </button>

          {thirdBanner.image_url && (
            <img
              src={thirdBanner.image_url}
              alt="Landscape Banner"
              className="w-full object-cover rounded-md mb-1 max-h-36 sm:max-h-42 md:max-h-24"
            />
          )}
          <a
            href={thirdBanner.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm sm:text-base md:text-lg font-semibold text-blue-700 hover:underline text-center"
          >
            {thirdBanner.title || "Lihat Penawaran Spesial Hari Ini!"}
          </a>
        </div>
      )}

      {/* Banner Bawah Floating (First Banner) */}
      {visible[0] && firstBanner && (
        <div
          ref={bannerRef}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-50 bg-yellow-400 text-black p-2 rounded-md shadow-md flex items-start space-x-2 sm:space-x-3"
          style={{ maxWidth: "320px", width: "100%" }}
        >
          <div className="flex-1 overflow-hidden">
            {firstBanner.image_url && (
              <img
                src={firstBanner.image_url}
                alt="Banner"
                className="w-full rounded mb-1 max-h-20 object-cover"
              />
            )}
            <a
              href={firstBanner.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-bold text-xs sm:text-sm truncate"
            >
              {firstBanner.title || "Promo Spesial Bulan Ini!"}
            </a>
          </div>
          <button
            onClick={() => handleClose(0)}
            className="text-black hover:text-gray-700 font-bold text-xl sm:text-2xl leading-none ml-1"
            aria-label="Close banner"
          >
            &times;
          </button>
        </div>
      )}

      {/* Banner Atas Floating (Second Banner) */}
      {visible[1] && secondBanner && (
        <div
          className="fixed left-4 right-4 sm:left-auto sm:right-8 z-50 bg-yellow-400 text-black p-2 rounded-md shadow-md flex items-start space-x-2 sm:space-x-3"
          style={{ bottom: bottomSecond, maxWidth: "320px", width: "100%" }}
        >
          <div className="flex-1 overflow-hidden">
            {secondBanner.image_url && (
              <img
                src={secondBanner.image_url}
                alt="Banner"
                className="w-full rounded mb-1 max-h-20 object-cover"
              />
            )}
            <a
              href={secondBanner.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-bold text-xs sm:text-sm truncate"
            >
              {secondBanner.title || "Promo Spesial Bulan Ini!"}
            </a>
          </div>
          <button
            onClick={() => handleClose(1)}
            className="text-black hover:text-gray-700 font-bold text-xl sm:text-2xl leading-none ml-1"
            aria-label="Close banner"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}

export default Banner;
