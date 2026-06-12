import React, { useState, useEffect } from 'react';
import useDebounce from './hooks/useDebounce';
import SearchBar from './components/SearchBar';
import PostCard from './components/PostCard';
import Pagination from './components/Pagination';
import PostDetail from './components/PostDetail';
import StatusCard from './components/StatusCard';
import './App.css';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [activePostId, setActivePostId] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://dummyjson.com/posts?limit=100');
      if (!response.ok) {
        throw new Error('Failed to retrieve posts from server.');
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const filteredPosts = posts.filter((post) => {
    const query = debouncedSearchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>InsightPosts</h1>
        <p>Explore articles, insights, and community comments</p>
      </header>

      {activePostId !== null ? (
        <PostDetail 
          postId={activePostId} 
          onBack={() => setActivePostId(null)} 
        />
      ) : (
        <>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {loading && (
            <StatusCard type="loading" message="Fetching latest articles..." />
          )}

          {error && (
            <StatusCard type="error" message={error} onRetry={fetchPosts} />
          )}

          {!loading && !error && (
            <>
              {filteredPosts.length === 0 ? (
                <StatusCard 
                  type="empty" 
                  message={`No matches found for "${debouncedSearchQuery}"`} 
                />
              ) : (
                <>
                  <div className="posts-grid">
                    {paginatedPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onClick={setActivePostId}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
