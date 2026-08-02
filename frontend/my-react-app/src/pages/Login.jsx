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
    <div>
      <form
        onSubmit={loginUser}
        className="flex flex-col gap-4 bg-gray-100 p-4 rounded w-3/4 mx-auto"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          type="email"
          name="email"
          className="border border-black p-2 rounded"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          className="border border-black p-2 rounded"
          placeholder="Password"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
