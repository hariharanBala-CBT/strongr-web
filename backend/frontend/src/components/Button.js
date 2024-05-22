import React from "react";

function Button({ type, onClick, className, text }) {
  return (
    <div>
      {onClick ? (
        <button className={className} type={type} onClick={onClick}>
          {text}
        </button>
      ) : (
        <button className={className} type={type}>
          {text}
        </button>
      )}
    </div>
  );
}
export default Button;
