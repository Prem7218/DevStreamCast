import React from 'react'
import { useOpen } from '../../../3_context/openContext';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Body_UL = ({setPage}) => {
  const { setAnonomusChat } = useOpen();
  const { qnsLen } = useSelector((store) => store.quizData);
  return (
    <ul className="space-y-2 text-gray-700">
        <li><Link to="/" onClick={() => setPage("Main")} className="hover:text-blue-600">🏠 Home</Link></li>
        <li><Link to="/" onClick={() => setPage("API")} className="hover:text-blue-600">🧪 API Testing</Link></li>
        <li><Link to={qnsLen > 0 ? "/devquiz" : "/devquizform"} className="hover:text-blue-600">📝 {qnsLen > 0 ? "Dev-is Quizing" : "DevQuiz Form"}</Link></li>
        <li><Link to="/devleetCode" className="hover:text-blue-600">💻 DevLeetCode</Link></li>
        <li><Link to="/" className="hover:text-blue-600">📂 DevRepositories</Link></li>
        <li><Link to="/dev-dsa-practice-sheet" className="hover:text-blue-600">📜 Dev DSA Practice</Link></li>
        <li><Link to="/profile" className="hover:text-blue-600">💻 Profile</Link></li>
        <li 
        onClick={() => setAnonomusChat((prev) => ({ ...prev, showanonomus: true }))}
        className="cursor-pointer hover:text-blue-600"
      >
        📂 AnonymousChat
      </li>
    </ul>
  )
}

export default Body_UL;
