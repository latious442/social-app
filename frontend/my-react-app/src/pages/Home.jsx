import React from "react";
import {useEffect,useState} from 'react';
import Item from "../components/Item";
const Home = () => {
  const [posts, setPosts] = useState([]); 
  useEffect(()=>{
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost:3003/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    }
    fetchPosts();
  }, []);
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">


      <div className="w-full max-w-xl flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No posts yet.</p>
        ) : (
          posts.map((post) => <Item key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};

export default Home;