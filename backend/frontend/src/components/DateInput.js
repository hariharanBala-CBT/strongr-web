import React from "react";

function DateInput({ id, value, onChange, required }) {
  return (
    <div className="select-date">
      <label className="form-label" htmlFor={id}>
        Date
      </label>
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
