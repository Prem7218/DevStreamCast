import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { uploadVideo } from "../../../constantData/Slices/meetRecordingSlice";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import ZIM from "zego-zim-web"; // ✅ Correct ZIM import
import {
  addMeetLink,
  remMeetLink,
} from "../../../constantData/Slices/meetSessionSlice";
import Searchs from "../../1_header/Search";
import { auth, database } from "../../../constantData/firebase";
import { get, ref, set } from "firebase/database";

const Meeting = () => {
  const loggedInUserUID = auth?.currentUser?.uid;

  useEffect(() => {
    if (!loggedInUserUID) {
      return;
    }
  }, []);

  const navigate = useNavigate();
  const { roomid, username } = useParams();
  const meetingRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const dispatch = useDispatch();
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const zegocloudInstance = useRef(null);
  const meetNow = useSelector((store) => store.meetNow);
  const previousMeet = meetNow.meetingLink || null;
  const [searchTerm1, setSearchTerm1] = useState("");
  const searchRef = useRef(null);
  const client = new WebTorrent();
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        console.log("Recording stopped on unmount");
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        console.log("Recording stopped due to page unload");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!window.WebTorrent) {
      console.error("WebTorrent failed to load.");
      return;
    }

    const client = new window.WebTorrent();
    console.log("WebTorrent client initialized:", client);
  }, []);

  useEffect(() => {
    if (!previousMeet && roomid && username) {
      const mainMeet = `/meeting/${roomid}/${username}`;
      console.log("MeetNow: ", previousMeet, "\nMeetNow's: ", mainMeet);
      dispatch(addMeetLink(mainMeet));
    }
  }, [dispatch, previousMeet, roomid, username]);

  useEffect(() => {
    if (!meetingRef.current || zegocloudInstance.current) return;

    const appID = 1325924461;
    const userId = `User-${Math.round(Math.random() * 10000)}`;
    const userName = username;
    const serverSecret = process.env.REACT_ZEEGOCLOUD_SECRET;

    if (!serverSecret) {
      console.error("❌ ZEGOCLOUD ERROR: Missing serverSecret.");
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomid,
      `User-${Math.round(Math.random() * 10000)}`,
      userName
    );

    // ✅ Initialize Zego instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    try {
      // ✅ Initialize ZIM properly
      const zimInstance = ZIM.createInstance(appID); // ✅ Correct initialization
      zp.addPlugins({ ZIM: zimInstance });
      console.log("✅ ZIM Plugin initialized successfully!");
    } catch (error) {
      console.log("❌ Failed to initialize ZIM plugin:", error);
    }

    zegocloudInstance.current = zp;

    // ✅ Generate actual meeting invite link
    const zegoInviteLink = `https://console.zegocloud.com/projectMgr/webDemoExperience?roomID=${roomid}&userID=${userId}`;

    zp.joinRoom({
      container: meetingRef.current,
      sharedLinks: [
        {
          name: "Share Invite Link",
          url: zegoInviteLink,
        },
      ],
      showWaitingCallAcceptAudioVideoView: true,
      onUserJoin: (user) => {
        alert(`User ${user.name} joined the meeting.`);
      },
      onUserLeave: (user) => {
        alert(`User ${user.name} left the meeting.`);
      },
      onLeaveRoom: () => {
        dispatch(remMeetLink());

        if (recording) {
          console.log("⏳ Stopping recording before exiting...");
          stopRecording();
          setTimeout(() => {
            finalizeMeetingExit();
          }, 2000); // Small delay to ensure recording stops
        } else {
          finalizeMeetingExit();
        }
      },
      showPreJoinView: false,
      scenario: {
        mode: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
        config: { role: "Host" },
      },
    });

    return () => {
      console.log("🔄 Cleaning up ZegoCloud Meeting...");
      try {
        stopRecording(); // ✅ Ensures recording stops when the user leaves
      } catch (error) {
        console.error("❌ Failed to stop recording:", error);
      } finally {
        if (zegocloudInstance.current) {
          zegocloudInstance.current.destroy();
          zegocloudInstance.current = null;
        }
      }
    };
  }, [roomid, username]);

  const finalizeMeetingExit = () => {
    if (zegocloudInstance.current) {
      try {
        if (recording) {
          stopRecording();
        }

        zegocloudInstance.current.destroy();
        zegocloudInstance.current = null;
      } catch (error) {
        console.log("❌ Error while cleaning up Zego instance:", error);
      }
    }
    alert("Meeting Ended!");
    navigate("/");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        console.log("Blob Link: ", url);

        const blob1 = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob1], "recorded-video.webm", {
          type: "video/webm",
        });

        client.seed(file, async (torrent) => {
          // ✅ Make this function async
          const magnetLink = torrent.magnetURI;
          console.log("Magnet Link:", magnetLink);

          // ✅ Dispatch to Redux store
          dispatch(uploadVideo(magnetLink));

          // ✅ Ensure Firebase update happens AFTER magnetLink is available
          if (loggedInUserUID) {
            const meetRef = ref(
              database,
              `meetrecord/private/${loggedInUserUID}`
            );

            try {
              const snapshot = await get(meetRef);
              let updatedRecordings = [];

              if (snapshot.exists()) {
                // ✅ Get the existing array or default to an empty array
                const existingData = snapshot.val();
                updatedRecordings = existingData.meetLinks || [];
              }

              // ✅ Append the new recording link
              updatedRecordings.push(magnetLink);

              // ✅ Store in Firebase
              await set(meetRef, { meetLinks: updatedRecordings });
              console.log(
                "✅ Firebase updated with new recording:",
                magnetLink
              );
            } catch (error) {
              console.log("❌ Firebase update failed:", error);
            }
          }
        });
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.log("Error starting screen recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
        console.log("✅ Recording stopped.");
      } catch (error) {
        console.error("❌ Error stopping recording:", error);
      }
      setRecording(false);
    }

    // Ensure all media tracks are stopped
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      console.log("✅ All media tracks stopped.");
      streamRef.current = null; // Clear reference
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Business Logo, Recording Buttons, and Search Component at Top */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          justifyItems: "center",
          alignItems: "center",
          width: "100%",
          gap: "15px",
          zIndex: 50,
        }}
      >
        <div className="w-full mx-3 flex">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAaVBMVEX///8AAAD+/v719fX7+/vv7+/4+Pjr6+uhoaGNjY2ZmZmTk5OkpKTExMTR0dHV1dU7OztHR0d5eXlaWlrk5OSsrKxtbW1PT08yMjLLy8u9vb1jY2O1tbUfHx+Hh4fe3t4nJycLCwsVFRXEqko2AAAD1UlEQVRoge1Xa7OiMAwNfQH1gbwVFa/3///ITZu2oM7sQu/O7hfOjKPBcpomp2kKsGHDhg0bNmzY8A/BGH6A0Q96gKawj6YxDmu56UNTvE85JwfxOmKp6+Ed8f7ghzAepuPOQMvw6JLvdvklDJI6NwNGGTFBkxCOYcKTMcsw4OAGRLnf0bt7z62seZaUZAaa/q+iyPf0cu/JL2QfMAnMCKck+xZFntLLX9yR52Rra6HzZD7TKHI40+suhaIn80QbwC/kBHEycq5m5KlbSJIoYzHYTf+uB/NyqEnkXhwm6EjOrq9iWknO+DNoDckrT55bk5NR8ogdalETQWHJek9eMrNrj2R0kdwM2qAPBo8kQMIU8gFjFEPPoAjeMbhN5IOx3aqamMJl46pon3ybuF4n8gqjkpJOryI6LD6JDwBuyU52tp4HletIlc92PGqZ8qe1n0zPcr2CkdEpYJcrSYxXcLm9DPYLy0k5qXQF8YvnrjKeJPT0rdxk8u6iv8Zt4+3xluV6PxxNRfKrZ34FdpKzcvFaUxGxkhbdyYvifB24KygtibL14TlmJKNmjedFnbzg6/BFLmde1DTLzYVrYcBtCrvkAyTGp11OrXDf20yeghCXup3Wn9zZZWbkZlQ1e7C0ImK97t+ZMSzSycJxiVnlNeJZ7PiL30/62jl5EKz408leXhHH8M54xNiCuFTJXXp5GDjdZeHBsNRv36Uk1SSvxtAVYU7TXeARByHt6dLt6fNUuQYU/H7lbqN/Y0EZ+r4INSupF1VEFtoIswd9c0idaDjeegUpJvfEQX1PS/kzNwuRNe6FTpZKmJdHKaC524bLnZ5YEY16FuDqg8IgNN2u9eZ6nyFabmOHR57M7IPFpVw5wR0Mo3C+C/ZaJfHncV6/l3EzkG4/N9Zzd6cIsQFnsDAe1two3ImYSPeuBIGJ01woc1dRrNECOLYXrGmZhJW3lclze/HZtzzXj12Xjh2qvc11c901lU6rXN7Gdt15z5g75k3PaTzSrazyYrym9Yj5qKs8bW/Het/0Om2rlcf91IVQtRAYFsWBK2ZjoEySMSwYKC6EWn/aTzpnXt/mqqY450pKTICcrl0rmwkWSktvrg1uayCNfDwGWRT8ATtOumcx97p5bWHBP8UxEil6rlTUhfPN9aRv6AHicYvle2fXnv1ZHRrJeXPoknvkfecDYnbk3MuytMfbihP495BfyQfuMbfjT5i7Q/nJnv+VO7+tVuMnu4jukV89R7Fd3tqL8038mNmyUwAOs6anG8RUe/8CjKOPIc9zfWgA4vbjhg0bNmzY8F/xC/YeI974+emLAAAAAElFTkSuQmCC"
            alt="Business Logo"
            className="h-20 w-20 rounded-full shadow-md border border-gray-300"
          />
          <div className="h-10">
            {!recording ? (
              <button
                onClick={startRecording}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 cursor-pointer"
              >
                Start Recording 🎥
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 cursor-pointer"
              >
                Stop Recording ⏹️
              </button>
            )}
          </div>
        </div>

        <div className="w-full">
          <div
            ref={searchRef}
            className={"w-1/2 p-2 border rounded-sm border-white mr-3"}
          >
            <Searchs
              setSearchTerm={setSearchTerm1}
              searchTerm={searchTerm1}
              isLogin={true}
              body={false}
              isConnectionsVisible={true}
              isPMeet={true}
            />
          </div>
        </div>
      </div>

      {/* Meeting Container */}
      <div ref={meetingRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default Meeting;
