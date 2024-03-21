import React from "react";

function SelectInput({ id, value, onChange, options , label,disabled }) {
  return (
    <div className="select">
      <label key={id} htmlFor={id}>
        Select {label} :&nbsp;
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((option) => (
          <option key={option.id} value={option.area_name ? option.area_name : option.game_name}>
            {option.area_name ? option.area_name : option.game_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
