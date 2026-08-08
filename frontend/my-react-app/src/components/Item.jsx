import React from "react";
import { Link } from "react-router-dom";

export default function Item({ post }) {
  return (
    <div className="bg-paper border border-line rounded-lg shadow-sm w-full max-w-xl">
      {post?.author?.id && (
        <Link
          to={`/user/${post.author.id}`}
          className="flex flex-row items-center hover:bg-cream"
        >
          {post.author.profile && (
            <img className="w-16 h-16 rounded-full object-cover p-2" src={post.author.profile} alt={post.author.name} />
          )}
          <h2 className="text-xl font-semibold text-ink p-4">{post.author.name}</h2>
        </Link>
      )}
      {post?.image && (
        <img className="w-full max-h-96 object-cover" src={post.image} alt="post" />
      )}
      <p className="p-4 text-ink">{post?.content}</p>
    </div>
  );
}
