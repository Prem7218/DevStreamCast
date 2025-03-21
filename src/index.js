console.log("✅ index.js is loaded!");
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const div = document.getElementById("mainBody");
if (div) {
  const root = ReactDOM.createRoot(div);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("❌ Element with ID 'mainBody' not found.");
}
