import React from "react";

function SelectInput({
  addSlots,
  disabled,
  id,
  label,
  onChange,
  options,
  required,
  removeSlots,
  value,
  useRadioButtons,
}) {
  if (useRadioButtons) {
    return (
      <>
        <label className="form-label">{label}</label>
        <div className="radio-group">
          {options?.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={`${id}-${option.id}`}
                name={id}
                value={option.name}
                checked={value === option.name}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
              />
              <label htmlFor={`${id}-${option.id}`}>
                {option.name.slice(0, 5) + option.name.slice(8, -3)}
              </label>
            </div>
          ))}
          {addSlots?.map((slot) => (
            <div key={slot.id}>
              <input
                type="radio"
                id={`${id}-${slot.id}`}
                name={id}
                value={slot.name}
                checked={value === slot.name}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
              />
              <label htmlFor={`${id}-${slot.id}`}>
                {slot.name.slice(0, 5) + slot.name.slice(8, -3)}
              </label>
            </div>
          ))}
        </div>
      </>
    );
  } else {
    return (
      <div className="mb-3">
        <label className="form-label" htmlFor={id}>
          {label}
        </label>
        <select
          className="form-select mt-3"
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        >
          {options?.map((option) => {
            if (!removeSlots?.some((slot) => slot.name === option.name)) {
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
}

export default SelectInput;
