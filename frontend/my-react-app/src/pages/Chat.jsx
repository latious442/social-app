import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
export default function Chat() {
  const [friends, setFriends] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchFriends() {
      try {
        const token = localStorage.getItem("token");

        if (!token || !user) {
          alert("No token found. Please login first.");
          return;
        }

        const response = await fetch("http://localhost:3003/users/friends/" + user.id, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFriends(data);
        } else {
          alert(data.message || "Failed to fetch friends.");
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchFriends();
  }, [user?.id]);

  return (
    <div>
      <h1>Friends</h1>

      {friends.map((friend) => (
        <div key={friend.id} className="bg-gray-200 p-4 rounded shadow mb-2 hover:bg-gray-300 cursor-pointer">
          <div>
            {friend.profile && (
              <img src={friend.profile} alt={friend.name} className="w-12 h-12 rounded-full object-cover mr-4" />
            )}
            {friend.name}
            </div>
          <Link to={`/chat/${friend.id}`} className="text-blue-500 hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
</svg>

          </Link>
        </div>
      ))}
    </div>
  );
}