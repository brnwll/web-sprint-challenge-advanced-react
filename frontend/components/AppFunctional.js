import React, { useState } from "react";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const [coordinates, setCoordinates] = useState("2, 2"); // TODO: update this to the initial coordinates
  const [message, setMessage] = useState(initialMessage);

  function getXY() {
    let index = -1;
    const find_B = (sq, idx) => (index = sq.innerHTML === "B" ? idx : index);
    const squares = document.querySelectorAll("#grid .square");
    squares.forEach((square, idx) => find_B(square, idx));
    return index;
  }

  function getXYMessage() {
    const idx = getXY();
    let x = Math.floor(idx / 3) + 1;
    let y = Math.floor(idx % 3) + 1;
    return `${x}, ${y}`;
  }

  function getNextIndex(direction) {
    const idx = getXY();
    if (direction === "left") return [0, 3, 6].includes(idx) ? idx : idx - 1;
    if (direction === "up") return idx < 3 ? idx : idx - 3;
    if (direction === "right") return [2, 5, 8].includes(idx) ? idx : idx + 1;
    if (direction === "down") return idx > 5 ? idx : idx + 3;
  }

  function reset() {
    const squares = document.querySelectorAll("#grid .square");
    squares.forEach((sq, idx) =>
      idx === initialIndex ? setSquare(sq, true) : setSquare(sq)
    );
    setCoordinates(getXYMessage());
    setMessage(initialMessage);
  }

  function setSquare(sq, set = false) {
    sq.innerHTML = set ? "B" : "";
    set ? sq.classList.add("active") : sq.classList.remove("active");
  }

  function move(evt) {
    const nextIndex = getNextIndex(evt.target.id);
    const squares = document.querySelectorAll("#grid .square");
    if (nextIndex === getXY()) setMessage(`You can't go ${evt.target.id}`);
    else {
      setSquare(squares[getXY()], false);
      setSquare(squares[nextIndex], true);
      setCoordinates(getXYMessage());
      setMessage(initialMessage);
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({coordinates})</h3>
        <h3 id="steps">You moved 0 times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === 4 ? " active" : ""}`}>
            {idx === 4 ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        {["left", "up", "right", "down"].map((direction) => (
          <button key={direction} id={direction} onClick={move}>
            {direction.toUpperCase()}
          </button>
        ))}
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
