import React from 'react'
import {useState, useEffect} from 'react'
export default function Admin() {
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
    <div>
      <h1>Admin</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}
          <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
