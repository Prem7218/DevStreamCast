import React, { useEffect, useState } from "react";
import { AVTAR, AVTAR_ID } from "../../../constantData/url_icons";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { SignJWT } from "jose";
import { useNavigate } from "react-router-dom";

const JitsiMeetingComponent = ({ nameId, emailId }) => {
  const navigate = useNavigate();
  const [jwt, setJWT] = useState("");
  const [meetingEnded, setMeetingEnded] = useState(false);

  const appId = process.env.REACT_ZEEGOCLOUD_APP_ID;
  const privateKeyPEM = process.env.REACT_APP_JAAS_PRIVATE_KEY;

  const payload = {
    context: {
      user: {
        id: AVTAR_ID,
        name: nameId,
        email: emailId,
        avatar: AVTAR,
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
