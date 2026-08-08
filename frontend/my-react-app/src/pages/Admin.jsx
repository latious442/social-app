import React from 'react'
import {useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom'
export default function Admin() {
  const isAdmin = localStorage.getItem('admin') === 'true';
  const [users, setUsers] = useState([]);
  async function handleDeleteUser(id) {
    try {
      const response = await fetch(`http://localhost:3003/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        console.error('Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  }
    useEffect(()=>{
        async function fetchUsers(){
            try{
                const response = await fetch('http://localhost:3003/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        }
        fetchUsers();
    }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {!isAdmin && <Navigate to="/admin-login" replace />}
      <h1 className="text-2xl font-bold text-ink mb-4">Admin</h1>
      <ul className="flex flex-col gap-2">
        {users.map(user => (
          <li key={user.id} className="bg-paper border border-line p-3 rounded flex justify-between items-center text-ink">
            {user.name} - {user.email}
          <button onClick={() => handleDeleteUser(user.id)} className="bg-[#b5655d] text-cream py-1 px-3 rounded hover:opacity-90">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
