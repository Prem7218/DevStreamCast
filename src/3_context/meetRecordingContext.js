import { createContext, useContext, useState } from "react";

export const MeetRecordContext = createContext();
export const MeetRecordingProvider = ({ children }) => {
    const [videoUrl, setVideoUrl] = useState([]);

    return (
        <MeetRecordContext.Provider value={{ videoUrl, setVideoUrl }}>
            {children}
        </MeetRecordContext.Provider>
    );
}

export const useMeetRecording = () => useContext(MeetRecordContext);

