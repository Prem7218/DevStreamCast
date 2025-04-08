import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { fetchProgrammingJoke } from "../constantData/mock_data";
import { useOpenZustand } from "../4_Zustand/useOpenZustand";
import { useOpen } from "../3_context/openContext";
import { useSelector } from "react-redux";

const useVoiceCommands = (navigate, setIsListening) => {
  const [scrollInterval, setScrollInterval] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("");
  const { searchTerm1, setSearchTerm1, showConnections, setShowConnections } =
    useOpenZustand();
  const setUserChatId = useOpenZustand((state) => state.setUserChatId);
  const { anonomusChat, setAnonomusChat, setShowChat, showChat, searchTerm, setSearchTerm } = useOpen();
  const { showEmojiPicker2, setShowEmojiPicker2, showEmojiPicker1, setShowEmojiPicker1 } = useOpenZustand();
  const all_user = useOpenZustand((state) => state.all_user);

  /** 🔹 Smooth manual scrolling */
  const smoothScroll = (direction) => {
    if (isAutoScrolling) return; 
    window.scrollBy({
      top: direction === "down" ? 500 : -500,
      behavior: "smooth",
    });
  };

  /** 🔹 Start auto-scroll */
  const startAutoScroll = (direction) => {
    if (isAutoScrolling || (scrollDirection && scrollDirection !== direction))
      return;

    stopAutoScroll(); 
    setIsAutoScrolling(true);
    setScrollDirection(direction);

    const interval = setInterval(() => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      if (
        (direction === "down" && scrollY + innerHeight >= scrollHeight - 5) ||
        (direction === "up" && scrollY <= 5)
      ) {
        stopAutoScroll();
        return;
      }

      window.scrollBy({
        top: direction === "down" ? 10 : -10,
        behavior: "smooth",
      });
    }, 100);

    setScrollInterval(interval);
  };

  /** 🔹 Stop auto-scroll */
  const stopAutoScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      setScrollInterval(null);
    }
    setIsAutoScrolling(false);
    setScrollDirection("");
  };

  /** 🔹 Voice Commands */
  const commands = [
    {
      command: "profile search *",
      callback: (speak) => {
        setSearchTerm(speak);
      }
    },
    {
      command: "Emoji",
      callback: () => {
        if(anonomusChat?.showanonomus && !anonomusChat?.sleepanonomus) {
          setShowEmojiPicker1(!showEmojiPicker1);
        }

        if(showConnections) {
          setShowEmojiPicker2(!showEmojiPicker2);
        }
      }
    },
    {
      command: "go home",
      callback: () => {
        // setIsListening(false);
        !isAutoScrolling && navigate("/");
      },
    },
    {
      command: "meet now",
      callback: () => {
        // setIsListening(false);
        !isAutoScrolling && navigate("/meetnow");
      },
    },
    {
      command: "devmeet now",
      callback: () => {
        // setIsListening(false);
        !isAutoScrolling && navigate("/meetnow");
      },
    },
    {
      command: "profile",
      callback: () => {
        // setIsListening(false);
        !isAutoScrolling && navigate("/profile");
      },
    },
    {
      command: "open connections chat",
      callback: () => {
        if (!showConnections) {
          setShowConnections(true);
          setAnonomusChat((prev) => ({ ...prev, showanonomus: false }));
        }
      },
    },
    {
      command: "search *",
      callback: (speak) => setSearchTerm1(speak),
    },
    {
      command: "now search *",
      callback: (speak) => {
        // Safely filter user from all_user array
        const foundUser = (all_user || []).find(
          (profile) => profile.name === speak
        );

        if (foundUser) {
          setSearchTerm1(speak);
          setShowChat((prev) => ({
            ...prev,
            showChat: true,
            sleepChat: false,
          }));
          setUserChatId(foundUser.uid);
        } else {
          alert("User not found. Please search using their full name.");
        }
      },
    },
    {
      command: "chat now",
      callback: () => {
        if (showChat?.showChat) {
          setShowChat((prev) => ({ ...prev, sleepChat: !prev?.sleepChat }));
        }
      },
    },
    {
      command: "close connections chat",
      callback: () => setShowConnections(false),
    },
    {
      command: "open chat",
      callback: () => {
        setShowConnections(false);
        setAnonomusChat((prev) => ({ ...prev, showanonomus: true }));
        setAnonomusChat((prev) => ({
          ...prev,
          sleepanonomus: false,
        }));
      },
    },
    {
      command: "close chat",
      callback: () =>
        setAnonomusChat((prev) => ({
          ...prev,
          sleepanonomus: true,
        })),
    },
    { command: "scroll down", callback: () => smoothScroll("down") },
    { command: "scroll up", callback: () => smoothScroll("up") },
    { command: "stop", callback: () => stopAutoScroll() },
    { command: "scroll stop", callback: () => stopAutoScroll() },
    { command: "stop scroll", callback: () => stopAutoScroll() },
    { command: "stop auto scroll", callback: () => stopAutoScroll() },
    { command: "auto stop scroll", callback: () => stopAutoScroll() },
    {
      command: "auto scroll *",
      callback: (direction) => {
        if (direction.includes("down")) startAutoScroll("down");
        else if (direction.includes("up")) startAutoScroll("up");
      },
    },
    {
      command: "tell me a joke",
      callback: () => {
        if (!isAutoScrolling) fetchProgrammingJoke();
      },
    },
    {
      command: "i am boring",
      callback: () => {
        if (!isAutoScrolling) fetchProgrammingJoke();
      },
    },
    {
      command: "make me laugh",
      callback: () => {
        if (!isAutoScrolling) fetchProgrammingJoke();
      },
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  /** 🔹 Handle Speech Recognition Setup */
  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.warn(
        "Speech recognition is not supported in this browser. Use Chrome."
      );
      return;
    }

    SpeechRecognition.startListening({ continuous: true, language: "en-US" });

    return () => {
      SpeechRecognition.stopListening();
      stopAutoScroll(); // Cleanup auto-scroll on unmount
    };
  }, []);

  return {
    startListening: () =>
      SpeechRecognition.startListening({ continuous: true, language: "en-US" }),
    stopListening: SpeechRecognition.stopListening,
    transcript,
  };
};

export default useVoiceCommands;
