import React, { useState, useEffect } from "react";
import axios from "axios";

/*
  TEST VALIDATION CODE (for reference)
  const { email, x, y, steps } = validated
  const code = (((x + 1) * (y + 2)) * (steps + 1)) + email.length
*/

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const endpoint = "http://localhost:9000/api/result";

export default function AppFunctional(props) {
  const [bIndex, setBIndex] = useState(initialIndex);
  const [coordinates, setCoordinates] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);

  const getX = () => Math.floor(bIndex % 3) + 1;
  const getY = () => Math.floor(bIndex / 3) + 1;
  const getCoordinates = (index) => index || `${getX()}, ${getY()}`;

  function getNextIndex(direction) {
    const idx = bIndex;
    if (direction === "left") return [0, 3, 6].includes(idx) ? idx : idx - 1;
    if (direction === "up") return idx < 3 ? idx : idx - 3;
    if (direction === "right") return [2, 5, 8].includes(idx) ? idx : idx + 1;
    if (direction === "down") return idx > 5 ? idx : idx + 3;
  }

  function reset() {
    setBIndex(initialIndex);
    setMessage(initialMessage);
    setSteps(initialSteps);
    setEmail(initialEmail);
  }

  function move(evt) {
    const nextIndex = getNextIndex(evt.target.id);
    if (nextIndex === bIndex) setMessage(`You can't go ${evt.target.id}`);
    else {
      setBIndex(nextIndex);
      setSteps(steps + 1);
      setMessage(initialMessage);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    axios
      .post(endpoint, { x: getX(), y: getY(), steps, email })
      .then((res) => {
        setMessage(res.data.message);
        setEmail(initialEmail);
      })
      .catch((err) => setMessage(err.response.data.message));
  }

  useEffect(() => {
    setCoordinates(getCoordinates());
  }, [bIndex]);

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({coordinates})</h3>
        <h3 id="steps">
          You moved {steps} time{steps !== 1 && "s"}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === bIndex ? " active" : ""}`}>
            {idx === bIndex ? "B" : null}
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
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
