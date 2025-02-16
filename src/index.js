import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MeetingForm from "./2_component/2_body/meeting/MeetNow";

const div = document.getElementById("mainBody");
const root= ReactDOM.createRoot(div);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


// import React from 'react';
// import './App.css';
// import JitsiMeetingComponent from './Demo/try';

// function App() {
//   return (
//     <div className="App">
//       <h1>Jitsi Meeting Integration</h1>
//         <JitsiMeetingComponent />
//     </div>
//   );
// }

// const div = document.getElementById("mainBody");
// const root= ReactDOM.createRoot(div);
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );


// import React from 'react';
// import ReactDOM from 'react-dom/client';  // Add this import
// import './App.css';
// import VideoGallery from './Demo/try'; // Ensure this path is correct

// const div = document.getElementById("mainBody");
// const root = ReactDOM.createRoot(div);

// root.render(
//   <React.StrictMode>
//     <VideoGallery />
//   </React.StrictMode>
// );
