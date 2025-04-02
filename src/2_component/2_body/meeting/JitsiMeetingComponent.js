import React, { useEffect, useState } from "react";
import { AVTAR, AVTAR_ID } from "../../../constantData/url_icons";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { SignJWT } from "jose";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addMeetLink,
  addParticipant,
  remMeetLink,
  removeParticipant,
} from "../../../constantData/Slices/meetSessionSlice";

const JitsiMeetingComponent = ({ nameId, emailId }) => {
  const { roomName } = useParams();
  const dispatch = useDispatch();
  const meetNow = useSelector((store) => store.meetNow);
  const firstMeetingURL = meetNow?.meetingLink || null;

  const navigate = useNavigate();
  const [jwt, setJWT] = useState("");
  const [meetingEnded, setMeetingEnded] = useState(false);

  const JAAS_TENANT = process.env.REACT_JAAS_TENANT;
  const appId = process.env.REACT_ZEEGOCLOUD_APP_ID;
  const privateKeyPEM = process.env.REACT_APP_JAAS_PRIVATE_KEY;

  // `https://8x8.vc/${JAAS_TENANT}/${roomName}`;

  useEffect(() => {
    if (!firstMeetingURL && emailId && nameId && roomName) {
      const relativeMeetingURL =
        firstMeetingURL || `/createdmeeting/${emailId}/${nameId}/${roomName}`;
      dispatch(addMeetLink(relativeMeetingURL));
    }
  }, [dispatch, emailId, nameId, roomName]);

  useEffect(() => {
    const fetchJWT = async () => {
      const token = await generateJWT();
      if (token) {
        setJWT(token);
      } else {
        console.log("Failed to fetch JWT, meeting may not work properly.");
      }
    };

    fetchJWT();
  }, []);

  const payload = {
    context: {
      user: {
        id: `host@${Math.floor(100 + Math.random() * 900)}`,
        name: nameId || "Guest",
        email: emailId || "guest@example.com",
        avatar: AVTAR || "default-avatar.png",
        moderator: true,
      },
    },
    aud: appId,
    iss: appId,
    sub: JAAS_TENANT || "meet.jit.si",
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
      console.log("Error generating JWT:", error);
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

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div style={styles.meetingContainer}>
        <JaaSMeeting
          appId={appId}
          roomName={roomName}
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

            externalApi.addListener("participantJoined", (participant) => {
              console.log("Participant Joined Event:", participant);
            
              dispatch((dispatch, getState) => {
                dispatch(
                  addParticipant({
                    id: participant.id,
                    displayName: participant.displayName || "Unknown",
                  })
                );
            
                const currentParticipants = getState().meetNow.participants; // ✅ Fetch latest Redux state
                console.log("Updated Participants List After Join:", currentParticipants);
              });
            });            
            
            externalApi.addListener("participantLeft", (participant) => {
              console.log("Participant Left Event:", participant);
            
              dispatch((dispatch, getState) => {
                const currentParticipants = getState().meetNow.participants; // ✅ Get fresh Redux state
                console.log("Updated Participants List Before Removal:", currentParticipants);
            
                // Find the participant who left
                const participantData = currentParticipants.find((p) => p.id === participant.id);
                const displayName = participantData ? participantData.displayName : "One Member Left the Meeting...";
            
                alert(`${displayName} left the meeting`);
            
                dispatch(removeParticipant(participant.id)); // ✅ Dispatch action correctly
              });
            });                  

            externalApi.addListener("readyToClose", () => {
              console.log("Meeting is ready to close.");
              setTimeout(() => {
                dispatch(remMeetLink());
                setMeetingEnded(true);
              }, 1000);
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
