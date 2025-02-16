import { Globe } from "lucide-react";
import React from "react";
import { FaTimes } from "react-icons/fa"; // For the close icon
import { useNavigate } from "react-router-dom";

const DevLoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = (id) => {
    onClose(); // Close the modal first
    navigate(`/authentication/${id}`); // Navigate to the login page
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Content */}
        <div className="text-center">
          {/* DEV Logo */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-300 text-white font-bold text-xl px-4 py-2 rounded-md">
              <div className="bg-white text-blue-600 rounded-full p-2">
                <Globe className="h-14 w-14" />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Log in to continue</h2>
          <p className="text-gray-600 mb-6">
            We're a place where coders share, stay up-to-date, and grow their
            careers.
          </p>

          {/* Buttons */}

          <button
            onClick={() => handleLogin(0)}
            className="bg-blue-600 text-white w-full py-2 rounded-lg font-medium mb-3 hover:bg-blue-700 transition duration-300"
          >
            Log in
          </button>

          <button
            onClick={() => handleLogin(1)}
            className="bg-transparent border border-blue-600 text-blue-600 w-full py-2 rounded-lg font-medium hover:bg-blue-100 transition duration-300"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevLoginModal;
