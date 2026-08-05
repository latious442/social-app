import { useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
export default function SearchResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { users = [], posts = [] } = state?.results || {};
  const search = state?.search || '';

  return (
    <div className="w-3/4 mx-auto py-8">
      <button onClick={() => navigate(-1)}>back</button>

      <h1 className="text-2xl font-bold mb-4">Search Results : {search}</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-gray-100 p-3 rounded flex justify-between hover:bg-gray-200 transition duration-200 cursor-pointer"
            >
              <span className="font-medium">{user.name}</span>
              {user.profile && (
                <img className="w-12 h-12 rounded-full object-cover" src={user.profile} alt="Profile" />
              )}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-bold mt-8 mb-2">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {posts.map((post) => (
            <li key={post.id} className="bg-gray-100 p-3 rounded hover:bg-gray-200 transition duration-200">
              <p>{post.content}</p>
              <p className="text-sm text-gray-500 mt-1">by {post.author?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
