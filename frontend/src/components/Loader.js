import Spinner from 'react-bootstrap/Spinner';
import React from 'react';

function Loader() {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        height: "100px",
        width: "100px",
        margin: "auto",
        display: "block",
        color: "black"
      }}
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  );
}

export default Loader;
