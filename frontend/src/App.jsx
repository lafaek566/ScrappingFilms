import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Page/Home";
import Login from "./Page/Login";
import Register from "./Page/Register";
import Admin from "./Page/Admin";
import AdminBanner from "./Page/AdminBanner";
import ScrapeButton from "./components/ScrapeButton";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Halaman utama */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Route admin utama tanpa proteksi */}
        <Route path="/admin" element={<Admin />} />
        {/* Route admin banner tanpa proteksi */}
        <Route path="/admin/banner" element={<AdminBanner />} />
        {/* Route admin scrape tanpa proteksi */}
        <Route path="/admin/scrape" element={<ScrapeButton />} />
        <Route path="/video-player" element={<VideoPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
