import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  async function loginUser(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:3003/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user",JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form
        onSubmit={loginUser}
        className="flex flex-col gap-4 bg-paper border border-line p-6 rounded w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-ink mb-2">Login</h1>

        <input
          type="email"
          name="email"
          className="border border-line p-2 rounded bg-white text-ink"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          className="border border-line p-2 rounded bg-white text-ink"
          placeholder="Password"
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
