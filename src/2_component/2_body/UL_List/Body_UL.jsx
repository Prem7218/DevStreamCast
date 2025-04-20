import React, { useState } from "react";
import { useOpen } from "../../../3_context/openContext";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CreatePostModal from "../profile_post/createPost/CreaatePostModal";

// Icons – refined set for better UX/UI
import {
  HiOutlineHome,
  HiOutlineBeaker,
  HiOutlinePlusCircle,
  HiOutlineClipboardList,
  HiOutlineCode,
  HiOutlineFolderOpen,
  HiOutlineUserCircle,
  HiOutlineChat,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { useOpenZustand } from "../../../4_Zustand/useOpenZustand";

const Body_UL = ({ setPage }) => {
  const { setAnonomusChat } = useOpen();
  const { qnsLen } = useSelector((store) => store.quizData);
  const open = useOpenZustand((state) => state.open);
  const setOpen = useOpenZustand((state) => state.setOpen);

  const linkClass =
    "flex items-center gap-3 px-3 py-1 rounded-md hover:bg-blue-50 hover:text-blue-600 transition";

  return (
    <ul className="space-y-2 text-gray-700 text-[15px] font-medium">
      <li>
        <Link to="/" onClick={() => setPage("Main")} className={linkClass}>
          <HiOutlineHome size={18} /> Home
        </Link>
      </li>

      <li>
        <Link to="/" onClick={() => setPage("G_Post")} className={linkClass}>
          <HiOutlineDocumentText size={18} /> Posts
        </Link>
      </li>

      <li>
        <Link to="/" onClick={() => setPage("API")} className={linkClass}>
          <HiOutlineBeaker size={18} /> API Testing
        </Link>
      </li>

      <li>
        <button
          onClick={() => setOpen(true)}
          className={`${linkClass} w-full text-left`}
        >
          <HiOutlinePlusCircle size={18} /> Create Post
        </button>
        <CreatePostModal isOpen={open} onClose={() => setOpen(false)} />
      </li>

      <li>
        <Link
          to={qnsLen > 0 ? "/devquiz" : "/devquizform"}
          className={linkClass}
        >
          <HiOutlineClipboardList size={18} />{" "}
          {qnsLen > 0 ? "Dev-is Quizzing" : "DevQuiz Form"}
        </Link>
      </li>

      <li>
        <Link to="/devleetCode" className={linkClass}>
          <HiOutlineCode size={18} /> DevLeetCode
        </Link>
      </li>

      <li>
        <Link to="/" className={linkClass}>
          <HiOutlineFolderOpen size={18} /> DevRepositories
        </Link>
      </li>

      <li>
        <Link to="/dev-dsa-practice-sheet" className={linkClass}>
          <HiOutlineClipboardList size={18} /> Dev DSA Practice
        </Link>
      </li>

      <li>
        <Link to="/profile" className={linkClass}>
          <HiOutlineUserCircle size={18} /> Profile
        </Link>
      </li>

      <li>
        <button
          onClick={() =>
            setAnonomusChat((prev) => ({ ...prev, showanonomus: true }))
          }
          className={`${linkClass} w-full text-left`}
        >
          <HiOutlineChat size={18} /> Anonymous Chat
        </button>
      </li>
    </ul>
  );
};

export default Body_UL;
