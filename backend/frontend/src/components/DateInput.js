import React from "react";

function DateInput({ id, value, onChange, required }) {
  return (
    <div className='select-date' style={{ display: "flex", flexDirection: "row" }}>
      <label htmlFor={id}>Date:</label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required = {required}
      />
    </div>
  );
}

export default DateInput;
