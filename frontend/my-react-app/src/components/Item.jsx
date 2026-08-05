import React from "react";

export default function Item({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-xl">
      <div className="flex flex-row">
        <img className="w-16 h-16 rounded-full object-cover" src={post?.author?.profile} alt={post?.author?.name} />
        <h2 className="text-xl font-semibold p-4">{post?.author?.name || 'Unknown Author'}</h2>
      </div>
      <p className="p-4 text-gray-800">{post?.content}</p>
    </div>
  );
}
