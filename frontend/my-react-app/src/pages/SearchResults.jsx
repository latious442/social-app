import { useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
export default function SearchResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { users = [], posts = [] } = state?.results || {};
  const search = state?.search || '';

  return (
    <div className="w-full max-w-3xl mx-auto p-4 py-8">
      <button onClick={() => navigate(-1)} className="bg-paper border border-line px-4 py-2 rounded text-ink hover:bg-cream">back</button>

      <h1 className="text-2xl font-bold text-ink mb-4">Search Results : {search}</h1>

      {users.length === 0 ? (
        <p className="text-muted">No users found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-paper border border-line p-3 rounded flex justify-between hover:bg-cream transition duration-200 cursor-pointer"
            >
              <span className="font-medium text-ink">{user.name}</span>
              {user.profile && (
                <img className="w-12 h-12 rounded-full object-cover" src={user.profile} alt="Profile" />
              )}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-bold text-ink mt-8 mb-2">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-muted">No posts found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {posts.map((post) => (
            <li key={post.id} className="bg-paper border border-line p-3 rounded hover:bg-cream transition duration-200">
              {post.image && (
                <img src={post.image} alt="post" className="mb-2 rounded max-h-48 w-full object-cover" />
              )}
              <p className="text-ink">{post.content}</p>
              <p className="text-sm text-muted mt-1">by {post.author?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
