import React, { useState, useEffect } from 'react';

export default function PostDetail({ postId, onBack }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`https://dummyjson.com/posts/${postId}`),
        fetch(`https://dummyjson.com/comments/post/${postId}`)
      ]);

      if (!postRes.ok || !commentsRes.ok) {
        throw new Error('Failed to retrieve post details or comments.');
      }

      const postData = await postRes.json();
      const commentsData = await commentsRes.json();

      setPost(postData);
      setComments(commentsData.comments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  if (loading) {
    return (
      <div className="detail-container">
        <button className="back-btn" onClick={onBack}>← Back to list</button>
        <div className="status-container loading-state">
          <div className="spinner"></div>
          <p>Loading post details and comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container">
        <button className="back-btn" onClick={onBack}>← Back to list</button>
        <div className="status-container error-state">
          <h3>Error Occurred</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button className="back-btn" onClick={onBack}>
        ← Back to list
      </button>

      {post && (
        <article className="post-detail-card">
          <span className="post-badge">Post #{post.id}</span>
          <h1 className="post-detail-title">{post.title}</h1>
          <p className="post-detail-body">{post.body}</p>
        </article>
      )}

      <section className="comments-section">
        <h2>Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="no-comments">No comments on this post yet.</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <span className="comment-author">{comment.user?.fullName || comment.user?.username || 'Anonymous'}</span>
                  <span className="comment-email">{comment.user?.username || 'user'}@xcentic.com</span>
                </div>
                <p className="comment-body">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
