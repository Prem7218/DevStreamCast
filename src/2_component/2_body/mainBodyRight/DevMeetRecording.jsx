import React, { useEffect, useRef } from "react";

const DevMeetRecording = ({ videos }) => {
  const videoRefs = useRef([]);

  useEffect(() => {
    if (!videos || videos.length === 0 || !window.WebTorrent) return;

    const client = new window.WebTorrent(); 

    videos.forEach((magnetURI, index) => {
      client.add(magnetURI, (torrent) => {
        const file = torrent.files.find((file) => file.name.endsWith(".webm"));

        if (file && videoRefs.current[index]) {
          file.renderTo(videoRefs.current[index]); 
        } else {
          console.error("No compatible video file found in torrent.");
        }
      });
    });

    return () => client.destroy();
  }, [videos]);

  return (
    <section className="bg-gray-100 shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        🎥 Dev Meet Recordings
      </h2>

      {/* Video Container */}
      <div className="overflow-y-auto max-h-96 p-2 space-y-4">
        {videos.length > 0 ? (
          videos.map((_, index) => (
            <video
              key={index}
              ref={(el) => (videoRefs.current[index] = el)}
              controls
              autoPlay
              className="w-[350px] h-[200px] rounded-lg shadow-md border border-gray-300"
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">
            No recordings available.
          </p>
        )}
      </div>
    </section>
  );
};

export default DevMeetRecording;
