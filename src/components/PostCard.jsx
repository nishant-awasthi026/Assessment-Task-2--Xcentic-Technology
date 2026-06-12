import React from 'react';

export default function PostCard({ post, onClick }) {
  const bodySnippet = post.body.length > 100 
    ? post.body.substring(0, 100) + '...' 
    : post.body;

  return (
    <div className="post-card" onClick={() => onClick(post.id)}>
      <div className="post-badge">Post #{post.id}</div>
      <h3 className="post-card-title">{post.title}</h3>
      <p className="post-card-body">{bodySnippet}</p>
      <div className="post-card-footer">
        <span>Read more</span>
        <span className="arrow">→</span>
      </div>
    </div>
  );
}
