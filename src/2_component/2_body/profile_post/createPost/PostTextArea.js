import React from "react";

const PostTextArea = ({ text1, setText, value, onChange, loading, onCursorChange, inputRef, setShowPreview }) => {
  const handleChange = (e) => {

    if(e.target.value.length === 0) {
      setShowPreview(false);
    }
    onChange(e.target.value);
    setText(e.target.value);
    onCursorChange(e.target.selectionStart);
  };
  
  if (loading) {
    return (
      <div className="bg-gray-100 p-4 rounded border border-gray-300 animate-pulse h-32">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
      </div>
    );
  }

  return (
    <textarea
      className="w-full p-3 border rounded-md text-sm resize-none focus:outline-none focus:ring focus:border-blue-300 overflow-auto"
      placeholder="What do you want to talk about?"
      rows={5}
      value={text1 || value}
      onChange={handleChange}
    />
  );
};

export default PostTextArea;

