import React from "react";

function SelectInput({ id, value, onChange, options, label, disabled, required, addSlots, removeSlots }) {
  return (
    <div className="select">
      <label htmlFor={id}>{label}:</label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {options?.map((option) => {
          if (!removeSlots?.some(slot => slot.name === option.name)) {
            return (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            );
          }
          return null;
        })}
        {addSlots?.map((slot) => (
          <option key={slot.id} value={slot.name}>
            {slot.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
