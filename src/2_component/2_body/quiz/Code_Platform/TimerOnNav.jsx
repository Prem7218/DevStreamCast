import React from "react";

const TimerOnNav = ({
  timeLimit,
  setTimeLimit,
  setTimer,
  setIsRunning,
  isRunning,
}) => {
  return (
    <>
      <label className="font-semibold">⏳ Set Timer (mins): </label>
      <select
        value={timeLimit}
        onChange={(e) => {
          setTimeLimit(Number(e.target.value));
          setTimer(Number(e.target.value) * 60);
        }}
        className="bg-gray-800 text-white px-2 py-1 rounded"
      >
        {[5, 10, 15, 20, 30].map((t) => (
          <option key={t} value={t}>
            {t} min
          </option>
        ))}
      </select>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="ml-3 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded"
      >
        {isRunning ? "Pause" : "Start"}
      </button>
    </>
  );
};

export default TimerOnNav;
