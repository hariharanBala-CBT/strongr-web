import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2";

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
  const selectRef = useRef();

  useEffect(() => {
    // Initialize select2
    $(selectRef.current).select2();

    // Cleanup on unmount
    return () => {
      $(selectRef.current).select2("destroy");
    };
  }, []);

  // Update select2 when value or options change
  useEffect(() => {
    $(selectRef.current).val(value).trigger("change");
  }, [value]);

  useEffect(() => {
    $(selectRef.current).trigger("change.select2");
  }, [addSlots, options, removeSlots]);

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
          className="select"
          id={id}
          ref={selectRef}
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
