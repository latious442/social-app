import React from "react";

export default function Item({ post }) {
  

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-xl">
      

      <p className="px-4 pb-4 text-gray-800">
        {post?.content}
      </p>
    </div>
  );
}
