import { useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
export default function SearchResults() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const results = state?.results || [];
  const search = state?.search || '';

  return (
    <div className="w-3/4 mx-auto py-8">
      <button onClick={() => navigate(-1)}>back</button>

      <h1 className="text-2xl font-bold mb-4">Search Results : {search}</h1>

      {results.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {results.map((user) => (
            <li
              key={user.id}
              className="bg-gray-100 p-3 rounded flex justify-between hover:bg-gray-200 transition duration-200 cursor-pointer"
            >
              <span className="font-medium">{user.name}</span>
              <img className="w-12 h-12 rounded-full object-cover" src={user.profile} alt="Profile" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
