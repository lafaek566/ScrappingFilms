import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Page/Home";
import Login from "./Page/Login";
import Register from "./Page/Register";
import Admin from "./Page/Admin";
import AdminBanner from "./Page/AdminBanner";
import ProtectedRoute from "./Page/ProtectedRoute";
import ScrapeButton from "./components/ScrapeButton";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Halaman utama */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Route admin utama */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        {/* Route admin banner */}
        <Route
          path="/admin/banner"
          element={
            <ProtectedRoute>
              <AdminBanner />
            </ProtectedRoute>
          }
        />
        {/* Route admin scrape */}
        <Route
          path="/admin/scrape"
          element={
            <ProtectedRoute>
              <ScrapeButton />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
