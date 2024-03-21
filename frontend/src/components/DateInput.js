import React from "react";

function DateInput({ id, value, onChange }) {
  return (
    <div className='select-date' style={{ display: "flex", flexDirection: "row" }}>
      <label htmlFor={id}>Date:</label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default DateInput;
