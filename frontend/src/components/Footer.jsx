import React from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div
        className="max-w-6xl mx-auto px-4 
                      grid grid-cols-1 gap-6 text-center
                      md:flex md:flex-row md:justify-between md:items-center md:text-left md:gap-0"
      >
        {/* Copyright */}
        <div>
          <p>&copy; {new Date().getFullYear()} FilmApp. All rights reserved.</p>
          <p className="text-sm mt-1">
            Developed by YourName — Enjoy watching your favorite films!
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 text-xl md:justify-start">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-green-500 transition-colors"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition-colors"
          >
            <FaInstagram />
          </a>
          <a
            href="https://youtube.com/yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-red-600 transition-colors"
          >
            <FaYoutube />
          </a>
        </div>

        {/* Address */}
        <div className="flex items-center justify-center space-x-2 text-sm md:justify-end">
          <FaMapMarkerAlt className="text-red-500" />
          <p>Jl. Sudirman No.123, Jakarta, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
