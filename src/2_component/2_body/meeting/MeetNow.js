import React, { useState } from "react";
import { User, IdCard, CalendarClock, Mail } from "lucide-react"; // Lucide icons
import { AiOutlineSend, AiOutlineUpload } from "react-icons/ai"; // React-icons
import { useNavigate } from "react-router-dom";

const MeetingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "User",
    userName: "",
    meetingId: "",
    email: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted for ${formData.role} - ${formData.userName}`);
    navigate(`/createdmeeting/${formData.email}/${formData.userName}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-center text-2xl font-bold text-blue-700 mb-4">
          {formData.role === "User" ? "User Meeting Form" : "Moderator Form"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="User">User</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>

          {/* Conditional Fields Based on Role */}
          {formData.role === "User" ? (
            <>
              {/* User Name */}
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
              {/* Meeting ID */}
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
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-2 text-orange-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </>
          ) : (
            <>
              {/* Moderator Name */}
              <div className="relative">
                <User className="absolute left-3 top-2 text-green-500" />
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter Name"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              {/* Moderator Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-2 text-orange-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              {/* Image Upload */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Upload Image</label>
                <div className="flex items-center space-x-2">
                  <AiOutlineUpload className="text-blue-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border rounded-lg py-2 px-4"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Image Preview:</p>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
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
