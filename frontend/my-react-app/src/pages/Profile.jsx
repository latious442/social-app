import React, { useState } from 'react'
import {useEffect} from 'react'
import { Link } from 'react-router-dom'
export default function Profile() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
 const [posts, setPosts] = useState([]);

 useEffect(() =>{
  async function fetchUserPosts() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please login first.');
        return;
      }

      const response = await fetch(`http://localhost:3003/posts/user/${user.id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        alert(data.message || 'Failed to fetch user posts.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while fetching user posts.');
    }
  }

  if (user) {
    fetchUserPosts();
  }
 }, [user?.id]);
  async function handleFileUpload(event) {
    event.preventDefault();
    const fileInput = event.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', user.id);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please login first.');
        return;
      }

      const response = await fetch('http://localhost:3003/users/upload-profile', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, profile: data.profile };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('File uploaded successfully!');
      } else {
        alert(data.message || 'File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong during file upload.');
    }
  }

  async function handleDeletePost(postId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please login first.');
        return;
      }

      const response = await fetch(`http://localhost:3003/posts/del/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        alert('Post deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete post.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while deleting the post.');
    }
  };

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

  async function handleAddPost(event) {
    event.preventDefault();
    const content = event.target.querySelector('textarea').value;

    if (!content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please login first.');
        return;
      }

      const response = await fetch(`http://localhost:3003/posts/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, userId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Post added successfully!');
        document.getElementById('add-post-form').style.display = 'none';
      } else {
        alert(data.message || 'Failed to add post.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while adding the post.');
    }
  }

  return (
    <div>
    
<div>
  <div className="justify-center items-center p-4">

      {user?.profile ? (
        <img className="w-32 h-32 rounded-full object-cover" src={user.profile} alt="Profile" />
      ) : null}


      <p> {user?.name || 'Not logged in'}</p>
     
      
      </div>
      <div id="pf-change" style={{ display: 'none' }} className="p-4">

      <form onSubmit={handleFileUpload}>
      <input type="file" className="border border-black p-2 rounded bg-green-500"></input>
     <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Upload</button>
      </form>

      </div>
      <div className="bg-gray-100 p-4 rounded mt-4 flex gap-3">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => {
          const pfChangeDiv = document.getElementById('pf-change');
          pfChangeDiv.style.display = pfChangeDiv.style.display === 'none' ? 'block' : 'none';
        }}>
          Change Profile 
        </button>
       
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => document.getElementById('add-post-form').style.display = 'block'}>
          add post
        </button>
         <Link to="/chat" className="bg-purple-500 text-white py-2 px-4 rounded-full w-15 h-15 hover:bg-purple-600">
          chat
        </Link>
</div>
<form id="add-post-form" className="mt-4" onSubmit={handleAddPost} style={{ display: 'none' }}>
  add post here
  <textarea className="w-full p-2 border border-gray-300 rounded" rows="4" placeholder="Write your post..."></textarea>
  <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2">Submit</button>
  <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mt-2 ml-2" onClick={() => document.getElementById('add-post-form').style.display = 'none'}>
    Cancel
  </button>
</form>


{posts.map(post => (
  <div key={post.id} className="bg-gray-200 p-4 rounded shadow mb-2">
    
    <p>
      {post.author.name}: {post.content}
      </p>
    <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2" onClick={() => handleDeletePost(post.id)}>
      Delete
    </button>
  </div>
))}


      </div>
    </div>
  )
}
