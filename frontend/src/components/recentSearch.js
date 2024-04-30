// RecentSearches.js
import React from "react";

const RecentSearches = ({ recentSearches }) => {
    return (
        <div className="recently-searched">
            <h3>Recently Searched:</h3>
            <ul>
                {recentSearches.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecentSearches;
