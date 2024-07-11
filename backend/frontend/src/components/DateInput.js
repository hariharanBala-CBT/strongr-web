import React from "react";

function DateInput({ label, id, value, onChange, required }) {
  return (
    <div className='select-date' style={{ display: "flex", flexDirection: "row" }}>
      <label htmlFor={id}>{label}:</label>
      <input
        className="form-control"
        type="date"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

export default DateInput;
