import { useState } from "react";

function Duration({ id, label, onNumChange, disabled }) {
  const [num, setNum] = useState(0);
  const maxLimit = 10;
  const minLimit = 0;

  // const incNum = () => {
  //   if (num < maxLimit) {
  //     setNum(num + 0.5);
  //     onNumChange(num + 0.5);
  //   }
  // };

  // const decNum = () => {
  //   if (num > minLimit) {
  //     setNum(num - 0.5);
  //     onNumChange(num - 0.5);
  //   }
  // };

  // const handleChange = (e) => {
  //   const newNum = parseInt(e.target.value, 10);
  //   if (!isNaN(newNum) && newNum >= minLimit && newNum <= maxLimit) {
  //     setNum(newNum);
  //     onNumChange(newNum);
  //   }
  // };

  return (
    <div className="hour-field">
      <label htmlFor={id}> {label} <br/>(in hrs) :&nbsp;</label>
      <div className="select-hour">
        {/* <div>
          <button type="button" onClick={decNum}>
            -
          </button>
        </div> */}
        <input
          type="text"
          className="form-control"
          value={num}
          disabled={disabled}
          // onChange={handleChange}
        />
        {/* <div>
          <button type="button" onClick={incNum}>
            +
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Duration;
