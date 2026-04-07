import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, isLoggedIn } from "./api";

export default function Login() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn()) navigate("/admin");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(token.trim());
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter admin token"
          className="w-full border rounded p-3"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-black text-white rounded p-3 disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
