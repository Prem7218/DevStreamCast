import React from 'react';

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-50 bg-opacity-70 z-50">
      {/* Spinner Animation */}
      <div className="animate-spin rounded-full h-24 w-24 border-8 border-t-8 border-[#FF6F61] border-t-transparent transition-all duration-500 ease-in-out"></div>
      {/* Loading Text Below Spinner */}
      <div className="mt-4 text-[#2B2D42] font-semibold text-lg">Loading...</div>
    </div>
  );
}

export default Spinner;
