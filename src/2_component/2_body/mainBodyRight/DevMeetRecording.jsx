import React from "react";

const DevMeetRecording = ({ videos }) => {
  return (
    <>
      <section className="bg-gray-100 shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          🎥 Dev Meet Recordings
        </h2>

        {/* Video Container */}
        <div className="overflow-y-auto max-h-96 p-2 space-y-4">
          {videos.length > 0 ? (
            videos.map((videoSrc, index) => (
              <video
                key={index}
                src={videoSrc}
                controls
                autoPlay
                muted
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
    </>
  );
};

export default DevMeetRecording;
