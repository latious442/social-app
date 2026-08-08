import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`http://localhost:3003/users/${id}`),
          fetch(`http://localhost:3003/posts/user/${id}`),
        ]);

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        if (userRes.ok) setUser(userData);
        if (postsRes.ok) setPosts(postsData);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProfile();
  }, [id]);

  if (!user) {
    return <p className="text-center text-muted mt-10">Loading...</p>;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <Link to="/" className="text-accent hover:underline text-sm">← Back to feed</Link>

      <div className="bg-paper border border-line rounded-lg shadow-sm p-6 mt-4 flex flex-col items-center">
        {user.profile ? (
          <img className="w-32 h-32 rounded-full object-cover" src={user.profile} alt={user.name} />
        ) : (
          <div className="w-32 h-32 rounded-full bg-cream border border-line flex items-center justify-center text-4xl text-muted">
            {user.name?.[0]?.toUpperCase()}
          </div>
        )}
        <h1 className="text-2xl font-bold text-ink mt-4">{user.name}</h1>
        <p className="text-muted">{user.email}</p>
      </div>

      <h2 className="text-xl font-bold text-ink mt-8 mb-2">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-muted">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-paper border border-line rounded-lg shadow-sm">
              {post.image && (
                <img className="w-full max-h-96 object-cover" src={post.image} alt="post" />
              )}
              <p className="p-4 text-ink">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
