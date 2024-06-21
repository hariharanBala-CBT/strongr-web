import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2";

function SelectInput({
  id,
  value,
  onChange,
  options,
  label,
  disabled,
  required,
  addSlots,
  removeSlots,
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
  }, [options, addSlots, removeSlots]);

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

export default SelectInput;
