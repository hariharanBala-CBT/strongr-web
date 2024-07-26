import React from "react";
import "../css/loading.css";

function Loading() {
  return (
    <div >
      <div className="spinner">
        <span>Loading...</span>
        <div className="half-spinner"></div>
      </div>
    </div>
  );
}

export default Loading;
