import React, { useEffect, useState } from "react";
import { SignJWT } from "jose";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { useNavigate } from "react-router-dom";

const JitsiMeetingComponent = ({ nameId, emailId }) => {
  const [jwt, setJWT] = useState("");
  const [meetingEnded, setMeetingEnded] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const appId = "vpaas-magic-cookie-2aca3da61c5d4f628d8987f593e2ddcf";
  const privateKeyPEM = process.env.REACT_APP_JAAS_PRIVATE_KEY;

  const payload = {
    context: {
      user: {
        id: `host@123`,
        name: `${nameId}`,
        email: `${emailId}`,
        avatar: "https://example.com/avatar.jpg",
        moderator: true,
      },
    },
    aud: appId,
    iss: appId,
    sub: "meet.jit.si",
    room: "*",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const generateJWT = async () => {
    try {
      const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        pemToArrayBuffer(privateKeyPEM),
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        true,
        ["sign"]
      );

      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "RS256" })
        .sign(cryptoKey);

      return jwt;
    } catch (error) {
      console.error("Error generating JWT:", error);
    }
  };

  const pemToArrayBuffer = (pem) => {
    const b64 = pem
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/\s+/g, "");
    const binary = atob(b64);
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  };

  useEffect(() => {
    const fetchJWT = async () => {
      const token = await generateJWT();
      setJWT(token);
    };

    fetchJWT();
  }, []);

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div style={styles.meetingContainer}>
        <JaaSMeeting
          appId={appId}
          roomName="Meet-Now"
          jwt={jwt}
          configOverwrite={{
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
          }}
          interfaceConfigOverwrite={{
            VIDEO_LAYOUT_FIT: "nocrop",
            MOBILE_APP_PROMO: false,
            TILE_VIEW_MAX_COLUMNS: 4,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.border = "none";
            iframeRef.style.zIndex = 10;
          }}
          onApiReady={(externalApi) => {
            console.log("Jitsi External API is ready!");

            externalApi.addListener("participantLeft", (participant) => {
              console.log(`${participant.displayName} left the meeting`);
            });

            externalApi.addListener("readyToClose", () => {
              console.log("Meeting is ready to close.");
              setMeetingEnded(true);
            });
          }}
        />
      </div>

      {meetingEnded && (
        <div style={styles.meetingEnded}>
          <h1>Meeting Ended</h1>
          <button onClick={handleGoToHome} style={styles.homeButton}>
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  meetingContainer: {
    height: "100vh",
    width: "100%",
    position: "relative",
    zIndex: 10,
  },
  meetingEnded: {
    zIndex: 20,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    background: "rgba(255, 255, 255, 0.9)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  homeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "18px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textDecoration: "none",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s",
    cursor: "pointer",
  },
};

export default JitsiMeetingComponent;


// import React from 'react';
// import { JaaSMeeting } from '@jitsi/react-sdk';

// const JitsiMeetingComponent = ({rootId}) => {
//   const jwtToken = "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMmFjYTNkYTYxYzVkNGY2MjhkODk4N2Y1OTNlMmRkY2YvZjJlNmRlLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3Mzk1Mzc1MzIsImV4cCI6MTczOTU0NDczMiwibmJmIjoxNzM5NTM3NTI3LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMmFjYTNkYTYxYzVkNGY2MjhkODk4N2Y1OTNlMmRkY2YiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6InByZW1yYWRoZXNoeWFtbWFoYWphbiIsImlkIjoiZ29vZ2xlLW9hdXRoMnwxMTcxMjc4MzY2OTg5NjQ0NjgwMDQiLCJhdmF0YXIiOiIiLCJlbWFpbCI6InByZW1yYWRoZXNoeWFtbWFoYWphbkBnbWFpbC5jb20ifX0sInJvb20iOiIqIn0.CzWa1IequArZ7VV8hd5rSE7VFRg5Y-B103XhVKgKvyG7HCbBlgQHEymomPoEdK3jcLVGZw0GLkSaX-7RSaGR5PIJmNoTDj-dlTgU7vOOJ34OLHXFglhEp9-bzET7a2huIE69G6g5E0cZkmRJFhTj_iQMc121QFsUq9aieiCFeAGTQSGZCeSY-e7w5mbsowEtD-Ajd_16RRjtSs_oqKY0urB_oSNl-GpLup4wSDD2v6tBlTDQGKhF2RF1YyjB8pogsGEnVDaglpz15LydE9EfuZrvh-tXyN2ygbV5azYu36Um9Z28yiMk8hsjhw9MpPUOKcGcTAFr_t556fGs55mISA"
//   const appId = "vpaas-magic-cookie-2aca3da61c5d4f628d8987f593e2ddcf";

//   return (
//     <div style={{ height: '600px', width: '100%', border: '1px solid #ccc' }}>
//       <JaaSMeeting
//         appId={appId}
//         roomName="Meet Now"
//         jwt={jwtToken}
//         configOverwrite={{
//           disableLocalVideoFlip: true,
//           backgroundAlpha: 0.5,
//           startWithAudioMuted: true,
//         }}
//         interfaceConfigOverwrite={{
//           VIDEO_LAYOUT_FIT: 'nocrop',
//           MOBILE_APP_PROMO: false,
//           TILE_VIEW_MAX_COLUMNS: 4,
//         }}
//         getIFrameRef={(iframeRef) => {
//           iframeRef.style.height = '100%';
//           iframeRef.style.border = 'none';
//         }}
//         onApiReady={(externalApi) => {
//           console.log('Jitsi External API is ready!', externalApi);
//         }}
//       />
//     </div>
//   );
// };

// export default JitsiMeetingComponent;

// import React, { useState } from "react";

// const VideoGallery = () => {
//   const [selectedVideo, setSelectedVideo] = useState("");
//   const [videos, setVideos] = useState([
//     {
//       title: "Video 1",
//       url: "https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp4",
//     },
//     {
//       title: "Video 2",
//       url: "https://res.cloudinary.com/demo/video/upload/v1234567891/sample2.mp4",
//     },
//     {
//       title: "Video 3",
//       url: "https://res.cloudinary.com/demo/video/upload/v1234567892/sample3.mp4",
//     },
//   ]);

//   // Handle video upload
//   const handleVideoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const videoUrl = URL.createObjectURL(file); // Generate a local URL for the uploaded video
//       const newVideo = {
//         title: file.name,
//         url: videoUrl,
//       };

//       setVideos((prevVideos) => [...prevVideos, newVideo]); // Add the new video to the list
//       setSelectedVideo(videoUrl); // Automatically select and play the uploaded video
//     }
//   };

//   return (
//     <div>
//       <h1>Select a Video to Watch or Upload Your Own</h1>

//       {/* Video Selection Dropdown */}
//       <select onChange={(e) => setSelectedVideo(e.target.value)} defaultValue="">
//         <option value="" disabled>Select a video</option>
//         {videos.map((video, index) => (
//           <option key={index} value={video.url}>
//             {video.title}
//           </option>
//         ))}
//       </select>

//       {/* Video Upload Section */}
//       <div style={{ marginTop: "20px" }}>
//         <h3>Upload a Video</h3>
//         <input type="file" accept="video/*" onChange={handleVideoUpload} />
//       </div>

//       {/* Video Player */}
//       {selectedVideo && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Now Playing:</h3>
//           <video width="640" height="360" controls>
//             <source src={selectedVideo} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoGallery;
