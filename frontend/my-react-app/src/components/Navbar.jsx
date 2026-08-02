import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex justify-between items-center">
        <ul className="flex gap-6 text-white">
          <li className="hover:underline">
            <Link to="/">Home</Link>
          </li>

          {!token ? (
            <>
              <li className="hover:underline">
                <Link to="/register">Register</Link>
              </li>

              <li className="hover:underline">
                <Link to="/login">Login</Link>
              </li>
            </>
          ) : (
            <>
              <li className="hover:underline">
                <Link to="/profile">
                  {user?.name}
                </Link>
              </li>

              <li className="hover:underline">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        <input
          className="w-64 rounded px-3 py-1 text-sm border border-black bg-white text-black"
          type="text"
          placeholder="Search..."
        />
      </div>
    </nav>
  );
}