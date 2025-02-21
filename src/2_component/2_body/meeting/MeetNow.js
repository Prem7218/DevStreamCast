import React, { useState } from "react";
import { User, IdCard, Mail } from "lucide-react"; 
import { AiOutlineSend } from "react-icons/ai"; 
import { useNavigate } from "react-router-dom";

const MeetingForm = () => {
  const navigate = useNavigate();
  const [meetingType, setMeetingType] = useState("");
  const [formData, setFormData] = useState({
    userEmail: "",
    userName: "",
    meetingId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMeetings = (e) => {
    e.preventDefault();
    
    if (!meetingType) {
      alert("Please select a meeting type first!");
      return;
    }

    const formattedUsername = formData.userName.trim().toLowerCase().replace(/\s+/g, "");

    if (meetingType === "global") {
      navigate(`/createdmeeting/${formData.userEmail}/${formattedUsername}`);
    } else {
      navigate(`/meeting/${formData.meetingId}/${formattedUsername}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-center text-2xl font-bold text-blue-700 mb-4">
          Create Dev-Meet-Now
        </h2>

        <form onSubmit={handleMeetings} className="space-y-4">
          {/* Meeting Type Selection */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Select Meeting</label>
            <select
              name="meetingType"
              className="w-full border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
            >
              <option value="">-- Choose Meeting Type --</option>
              <option value="global">🌍 Global Meet Join</option>
              <option value="private">🔒 Private Meet Join</option>
            </select>
          </div>

          {/* Conditional Fields Based on Meeting Type */}
          {meetingType === "global" ? (
            <>
              <div className="relative">
                <User className="absolute left-3 top-2 text-green-500" />
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter User Name"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-2 text-green-500" />
                <input
                  type="email"
                  name="userEmail"
                  placeholder="Enter Email-Id here..."
                  value={formData.userEmail}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <User className="absolute left-3 top-2 text-green-500" />
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter name here..."
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="relative">
                <IdCard className="absolute left-3 top-2 text-blue-500" />
                <input
                  type="text"
                  name="meetingId"
                  placeholder="Enter Meeting ID"
                  value={formData.meetingId}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"
          >
            <AiOutlineSend />
            <span>Submit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MeetingForm;
