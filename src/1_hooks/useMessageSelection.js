import { useState } from "react";

const useMessageSelection = () => {
  const [selectedMessages, setSelectedMessages] = useState({});
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // 🔹 Toggle Selection Mode
  const toggleSelectionMode = () => {
    setIsSelectionMode((prev) => !prev);
    setSelectedMessages({}); // Clear selection when exiting mode
  };

  // 🔹 Toggle Individual Message Selection
  const toggleMessageSelection = (messageId) => {
    setIsSelectionMode(true); // Enable selection mode automatically on click

    setSelectedMessages((prev) => {
      const updatedSelection = { ...prev };
      if (updatedSelection[messageId]) {
        delete updatedSelection[messageId]; // Deselect if already selected
      } else {
        updatedSelection[messageId] = true; // Select if not selected
      }
      return updatedSelection;
    });
  };

  // 🔹 Select All Messages
  const selectAllMessages = (messages) => {
    const allSelected = messages.reduce((acc, msg) => {
      acc[msg.id] = true;
      return acc;
    }, {});
    setSelectedMessages(allSelected);
    setIsSelectionMode(true);
  };

  // 🔹 Clear All Selections
  const clearSelection = () => {
    setSelectedMessages({});
    setIsSelectionMode(false);
  };

  return {
    selectedMessages,
    isSelectionMode,
    toggleSelectionMode,
    toggleMessageSelection,
    selectAllMessages,
    clearSelection,
  };
};

export default useMessageSelection;
