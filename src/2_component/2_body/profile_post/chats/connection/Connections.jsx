import React from "react";
import { IoArrowBack } from "react-icons/io5";
import Connection from "./Connection";

const Connections = ({ connections, setConnListOpen }) => {

  return (
    <div className="fixed inset-0 bg-transparant flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-[400px] max-h-[80vh] flex flex-col">
       
        <div className="flex items-center p-4 border-b">
          <button onClick={() => setConnListOpen(false)} className="text-xl">
            <IoArrowBack />
          </button>
          <h2 className="text-xl font-bold mx-auto">Your Connections</h2>
        </div>

        <Connection
          connections={connections}
          setConnListOpen={setConnListOpen}
        />
      </div>
    </div>
  );
};

export default Connections;
