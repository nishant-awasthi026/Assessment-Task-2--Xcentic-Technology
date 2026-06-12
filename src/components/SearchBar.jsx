import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search posts by title or content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="clear-btn" onClick={() => onChange('')} title="Clear search">
          x
        </button>
      )}
    </div>
  );
}
