import React from "react";

function SearchBar({ placeholder }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-bar"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;