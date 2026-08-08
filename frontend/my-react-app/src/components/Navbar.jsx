import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useState} from 'react';
export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [search, setSearch] = useState('');
  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const response = await fetch(`http://localhost:3003/users/search?search=${encodeURIComponent(search)}`);
      const data = await response.json();
      navigate('/search-results', { state: { results: data, search } });
      setSearch('');
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }

  return (
    <nav className="bg-paper border-b border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto">
        <ul className="flex flex-wrap items-center gap-4 text-ink">
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


              <form onSubmit={handleSearch} className="flex">

        <input
          className="w-full sm:w-64 rounded px-3 py-1 text-sm border border-line bg-white text-ink"
          type="text"
          placeholder="Search..." name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-accent text-paper hover:bg-accent-dark py-1 px-4 rounded ml-1">
            search
          </button>
        </form>

         <li className="hover:underline bg-sage text-cream rounded px-3 py-1">
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

      </div>
    </nav>
  );
}
