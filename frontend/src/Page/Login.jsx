// src/Page/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      alert("Login gagal, cek username dan password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-gray-900 shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md border border-gray-700 transition-all">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 text-white tracking-wide">
          Masuk ke Akun Anda
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm sm:text-base"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
          >
            Login
          </button>
        </form>
        <p className="text-xs sm:text-sm text-center mt-6 text-gray-400">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-semibold"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
