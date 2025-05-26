import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("✅ Register berhasil! Silakan login.");
      navigate("/login");
    } else {
      const error = await res.json();
      alert("❌ Gagal register: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-900 shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md border border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 text-white tracking-wide">
          Daftar Akun Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-800 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user" className="bg-gray-900">
              User
            </option>
            <option value="admin" className="bg-gray-900">
              Admin
            </option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white py-2 sm:py-3 rounded-xl font-semibold"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center mt-4 sm:mt-6 text-gray-400">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:underline font-semibold"
          >
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
