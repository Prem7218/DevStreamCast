import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadVideo } from "../../../constantData/Slices/meetRecordingSlice";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Meeting = () => {
  const { roomid, username } = useParams();
  const meetingRef = useRef();
  const [recording, setRecording] = useState(false);
  const dispatch = useDispatch();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    let zp;

    const initMeeting = () => {
      const appID = 1080956435;
      const userId = `User-${Math.round(Math.random() * 10000)}`;
      const userName = username;
      const serverSecret = process.env.REACT_ZEEGOCLOUD_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomid,
        userId,
        userName
      );

      zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: meetingRef.current,
        sharedLinks: [
          {
            name: "Share Meeting Link",
            url: `${window.location.origin}/meeting/${roomid}/${username}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    };

    initMeeting();

    return async () => {
      if (zp) {
        try {
          await stopRecording();
        } catch (error) {
          console.error("Failed to stop recording:", error);
        } finally {
          zp.destroy();
        }
      }
    };
  }, [roomid]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        dispatch(uploadVideo(url));
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Business Logo & Recording Buttons at Top Left */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 z-40"
          >
            Start Recording 🎥
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 z-40"
          >
            Stop Recording ⏹️
          </button>
        )}
      </div>

      {/* Meeting Container */}
      <div ref={meetingRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default Meeting;
