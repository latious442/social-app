import React, { useState } from 'react'
import {useEffect} from 'react'
import { Link } from 'react-router-dom'
export default function Profile() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
 const [posts, setPosts] = useState([]);

 useEffect(() => {
  async function syncUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      const response = await fetch(`http://localhost:3003/users/${user.id}`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  }

  syncUser();
 }, [user?.id]);

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

 useEffect(() =>{
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
    const fileInput = event.target.querySelector('input[type="file"]');
    const file = fileInput?.files[0];

    if (!content.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('userId', user.id);
    if (file) {
      formData.append('image', file);
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
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Post added successfully!');
        document.getElementById('add-post-form').style.display = 'none';
        fetchUserPosts();
      } else {
        alert(data.message || 'Failed to add post.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while adding the post.');
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
    
<div>
  <div className="justify-center items-center p-4">

      {user?.profile ? (
        <img className="w-32 h-32 rounded-full object-cover" src={user.profile} alt="Profile" />
      ) : null}


      <p className="text-ink text-lg mt-2"> {user?.name || 'Not logged in'}</p>
      
      
      </div>
      <div id="pf-change" style={{ display: 'none' }} className="p-4">

      <form onSubmit={handleFileUpload}>
      <input type="file" className="border border-line p-2 rounded bg-white"></input>
     <button type="submit" className="bg-accent text-paper py-2 px-4 rounded hover:bg-accent-dark">Upload</button>
      </form>

      </div>
      <div className="bg-paper border border-line p-4 rounded mt-4 flex gap-3 flex-wrap">
        <button className="bg-accent text-paper py-2 px-4 rounded hover:bg-accent-dark" onClick={() => {
          const pfChangeDiv = document.getElementById('pf-change');
          pfChangeDiv.style.display = pfChangeDiv.style.display === 'none' ? 'block' : 'none';
        }}>
          Change Profile 
        </button>
       
        <button className="bg-accent text-paper py-2 px-4 rounded hover:bg-accent-dark" onClick={() => document.getElementById('add-post-form').style.display = 'block'}>
          add post
        </button>
         <Link to="/chat" className="bg-sage text-cream py-2 px-4 rounded-full hover:opacity-90">
          chat
        </Link>
</div>
<form id="add-post-form" className="mt-4 bg-paper border border-line p-4 rounded" onSubmit={handleAddPost} style={{ display: 'none' }}>
  add post here
  <textarea className="w-full p-2 border border-line bg-white rounded" rows="4" placeholder="Write your post..."></textarea>
  <input type="file" accept="image/*" className="w-full p-2 border border-line bg-white rounded mt-2" />
  <button type="submit" className="bg-accent text-paper py-2 px-4 rounded hover:bg-accent-dark mt-2">Submit</button>
  <button type="button" className="bg-muted text-cream py-2 px-4 rounded hover:opacity-90 mt-2 ml-2" onClick={() => document.getElementById('add-post-form').style.display = 'none'}>
    Cancel
  </button>
</form>


{posts.map(post => (
  <div key={post.id} className="bg-paper border border-line p-4 rounded shadow-sm mb-2">
    
    <p className="text-ink">
      {post.author.name}: {post.content}
      </p>
    {post.image && (
      <img src={post.image} alt="post" className="mt-2 rounded max-h-72 w-full object-cover" />
    )}
    <button className="bg-[#b5655d] text-cream py-1 px-3 rounded hover:opacity-90 ml-2" onClick={() => handleDeletePost(post.id)}>
      Delete
    </button>
  </div>
))}


      </div>
    </div>
  )
}
