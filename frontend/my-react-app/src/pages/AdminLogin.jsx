import React from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "123456";

export default function AdminLogin() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const password = e.target.password.value;

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin", "true");
      navigate("/admin");
    } else {
      alert("Wrong admin password.");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-paper border border-line p-6 rounded w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-ink mb-2">Admin Login</h1>

        <input
          type="password"
          name="password"
          className="border border-line p-2 rounded bg-white text-ink"
          placeholder="Admin password"
          required
        />

        <button
          type="submit"
          className="bg-ink text-cream py-2 px-4 rounded hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
