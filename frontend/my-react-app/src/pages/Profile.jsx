import React, { useState } from 'react'

export default function Profile() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  async function checkProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please login first.');
      return;
    }

    const response = await fetch('http://localhost:3003/users/me', {
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      alert(`Logged in as ${data.email}`);
    } else {
      alert(data.message || 'JWT did not verify.');
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={checkProfile}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Check JWT
      </button>

      <p>username: {user?.name || 'Not logged in'}</p>
    </div>
  )
}
