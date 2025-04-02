import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useOpen } from "../../../3_context/openContext";
import DevMeetRecording from "../mainBodyRight/DevMeetRecording";
import Connections from "./chats/connection/Connections";
import { get, ref, set } from "firebase/database";
import { auth, database } from "../../../constantData/firebase";
import { fetchProfiles } from "../../../Authentications/login/profileFetcher";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const navigate = useNavigate();
  const { puid } = useParams();
  const loggedInUserUID = puid || auth.currentUser?.uid;
  
  useEffect(() => {
    if (!loggedInUserUID) {
      navigate("/authentication/1");
      return;
    }
  }, []);

  const meetNow = useSelector((store) => store.meetNow);
  const firstMeetingURL = meetNow?.meetingLink || null;

  const { user, setUser, ConnListOpen, setConnListOpen, setAnonomusChat } =
    useOpen();

  const { qnsLen } = useSelector((store) => store.quizData);
  const dispatch = useDispatch();
  const userProfiles = useSelector((state) => state.profile.userProfiles);
  const [loading, setLoading] = useState(true);
  const [followCheck, setFollowCheck] = useState(false);
  const videos = useSelector((store) => store.meetRecording || []);
  const mainst = auth.currentUser?.uid;

  useEffect(() => {
    // Fetch user profiles from Redux store
    if (userProfiles.length === 0) {
      dispatch(fetchProfiles());
    }

    // Check if the logged-in user's profile exists in Firebase
    const userRef = ref(database, `users/${loggedInUserUID}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUser(snapshot.val()); // Set user profile if it exists
      } else {
        setUser(null); // No profile found
      }
      setLoading(false);
    });
  }, [loggedInUserUID, dispatch, userProfiles, navigate]);

  useEffect(() => {
    setAnonomusChat((prev) => ({
      ...prev,
      sleepanonomus: false,
      showanonomus: false,
    }));
  }, []);

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        const userRef = ref(database, `users/${mainst}/connections`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const connections = snapshot.val();

          // ✅ Correct way to check if the user is already in connections
          setFollowCheck(
            connections.some((conn) => conn?.uid === loggedInUserUID)
          );
        } else {
          setFollowCheck(false);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkIfFollowing();
  }, [loggedInUserUID, mainst]);

  //////////////////////////////////////////////////////////////////////////////////////////

  const handleFollow = async (targetProfile, addOrRemove) => {
    try {
      const userRef = ref(database, `users/${mainst}/connections`);

      // Fetch current connections (array)
      const snapshot = await get(userRef);
      let currentConnections = snapshot.exists() ? snapshot.val() : [];

      if (!Array.isArray(currentConnections)) {
        currentConnections = []; // Ensure it's an array
      }

      if (addOrRemove === "add") {
        // Minimal profile data to store
        const connectionData = {
          uid: targetProfile.uid,
          name: targetProfile.name,
          profilePic: targetProfile.profilePic || "",
          title: targetProfile.title || "No Title",
        };

        // ✅ Add to the next index
        currentConnections.push(connectionData);

        await set(userRef, currentConnections); // Update array in Firebase
        setFollowCheck(true);
      } else if (addOrRemove === "remove") {
        // ✅ Remove only the specific profile
        const updatedConnections = currentConnections.filter(
          (conn) => conn.uid !== targetProfile.uid
        );

        await set(userRef, updatedConnections); // Update Firebase
        setFollowCheck(false);
      }
    } catch (error) {
      console.error("Error updating connections:", error);
    }
  };

  const handleCount2 = async (addOrRemove) => {
    try {
      const countRef = ref(database, `users/${mainst}/connectionsCount`);

      // Fetch current connection count
      const snapshot = await get(countRef);
      let currentCount = snapshot.exists() ? snapshot.val() : 0;

      if (addOrRemove === "add") {
        // Increase count
        await set(countRef, currentCount + 1);
        console.log(`You are now following someone!`);
      } else if (addOrRemove === "remove") {
        if (currentCount > 0) {
          // Decrease count (ensure it never goes below 0)
          await set(countRef, Math.max(0, currentCount - 1));
          console.log(`You have unfollowed someone!`);
        } else {
          console.log("No connections to remove.");
        }
      }
    } catch (error) {
      console.error("Error updating connections count:", error);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading Profile...
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-xl font-semibold text-red-500">
          No profile found. Please set up your profile.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-around items-start">
      <div className="w-full lg:w-3/4 max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden mt-5">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative w-full h-48 bg-gray-200">
            <img
              src={
                user.backgroundImg ||
                "https://via.placeholder.com/1200x400?text=Profile+Cover"
              }
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute left-5 bottom-[-40px]">
              <img
                src={
                  user.profilePic ||
                  "https://via.placeholder.com/150?text=Profile"
                }
                alt="Profile"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* User Information */}
          <div className="p-6 mt-10 text-center md:text-left">
            <h2 className="text-2xl font-bold">{user.name || "User Name"}</h2>
            <p className="text-gray-600">{user.title || "Job Title"}</p>
            <p className="text-gray-500">{user.location || "Location"}</p>
            <button
              onClick={() => setConnListOpen(true)}
              className="text-blue-600 font-semibold mt-2 cursor-pointer"
            >
              {user.connectionsCount || 0} connections
            </button>
            <br />
            <button
              onClick={() => navigate("/profile-form")}
              className={`text-blue-600 font-semibold mt-2 cursor-pointer ${
                puid === loggedInUserUID ? "hidden" : "block"
              }`}
            >
              Edit Profile
            </button>

            {ConnListOpen && (
              <Connections
                connections={user?.connections}
                setConnListOpen={setConnListOpen}
              />
            )}

            <div className="flex items-center gap-3 mt-2">
              {/* Follow/Unfollow Button */}
              <button
                onClick={() => {
                  if (followCheck) {
                    handleFollow(user, "remove");
                    handleCount2("remove");
                  } else {
                    handleFollow(user, "add");
                    handleCount2("add");
                  }
                  setFollowCheck(!followCheck);
                }}
                className={`px-5 py-2 rounded-md font-medium transition-all duration-300 ${
                  followCheck
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } ${
                  !puid || puid === auth.currentUser?.uid ? "hidden" : "block"
                }`}
              >
                {followCheck ? "Un-Follow" : "Follow"}
              </button>

              {/* Message Button */}
              <button
                className={`px-5 py-2 rounded-md font-medium transition-all duration-300 ${
                  followCheck
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-gray-300 text-gray-700 cursor-not-allowed"
                } ${
                  !puid || puid === auth.currentUser?.uid ? "hidden" : "block"
                }`}
                disabled={!followCheck}
                onClick={() => navigate(`/chat/${puid}`)}
              >
                {followCheck ? "Message" : "🔒 Message"}
              </button>
            </div>
          </div>

          {/* Sections Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 border-t bg-gray-50">
            {/* ✅ Solved Questions */}
            <div className="p-5 bg-white rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold flex items-center">
                🎯 Solved Questions
              </h3>
              <div className="flex gap-6 mt-4 text-lg">
                <p className="text-green-600 font-medium">
                  ✅ {user.solvedQuestions?.correct || 0} Correct
                </p>
                <p className="text-yellow-600 font-medium">
                  🕒 {user.solvedQuestions?.pending || 0} Pending
                </p>
                <p className="text-red-600 font-medium">
                  ❌ {user.solvedQuestions?.wrong || 0} Wrong
                </p>
              </div>
            </div>

            {/* ✅ Achievements */}
            <div className="p-5 bg-white rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold flex items-center">
                🏅 Achievements
              </h3>
              {user.achievements && user.achievements.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className="bg-green-500 text-white text-sm px-3 py-1 rounded-full"
                    >
                      {achievement.title}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No achievements earned.</p>
              )}
            </div>

            {/* ✅ MCQ & Aptitude Stats */}
            <div className="p-5 bg-white rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold flex items-center">
                📊 MCQ & Aptitude Stats
              </h3>
              {user.mcqAptiStats?.subjects &&
              Object.keys(user.mcqAptiStats.subjects).length > 0 ? (
                <ul className="list-disc list-inside mt-3 text-gray-700">
                  {Object.entries(user.mcqAptiStats.subjects).map(
                    ([subject, count]) => (
                      <li key={subject} className="text-gray-800">
                        {subject}:{" "}
                        <span className="font-semibold">{count}</span> Questions
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">
                  No MCQ/Aptitude stats available.
                </p>
              )}
            </div>

            {/* ✅ Saved / Bookmarked Questions */}
            <div className="p-5 bg-white rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold flex items-center">
                📌 Saved Questions
              </h3>
              {user.savedQuestions && user.savedQuestions.length > 0 ? (
                <p className="text-gray-800 mt-3">
                  {user.savedQuestions.length} questions saved.
                </p>
              ) : (
                <p className="text-gray-500 mt-2">No saved questions.</p>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold">About</h3>
          <p className="text-gray-700 mt-2">
            {user.bio || "No bio available."}
          </p>
        </div>

        {/* Experience Section */}
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold">Experience</h3>
          {user.experience && user.experience.length > 0 ? (
            user.experience.map((job, index) => (
              <div key={index} className="mt-2">
                <h4 className="font-medium">{job.company || "Company Name"}</h4>
                <p className="text-gray-600">{job.role || "Role"}</p>
                <p className="text-gray-500">{job.duration || "Duration"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience added.</p>
          )}
        </div>

        {/* Education Section */}
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold">Education</h3>
          {user.education && user.education.length > 0 ? (
            user.education.map((edu, index) => (
              <div key={index} className="mt-2">
                <h4 className="font-medium">
                  {edu.institution || "Institution"}
                </h4>
                <p className="text-gray-600">{edu.degree || "Degree"}</p>
                <p className="text-gray-500">{edu.year || "Year"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education details added.</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold">Skills</h3>
          <div className="flex flex-wrap mt-2">
            {/* ✅ Ensure user.skills exists and is an object before accessing it */}
            {user.skills &&
            typeof user.skills === "object" &&
            Object.keys(user.skills).length > 0 ? (
              Object.entries(user.skills) // ✅ Convert object into key-value pairs
                .flatMap(([category, skills]) =>
                  Array.isArray(skills) ? skills.map((skill) => skill) : []
                )
                .map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    {skill}
                  </span>
                ))
            ) : (
              <p className="text-gray-500">No skills added.</p>
            )}
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-1/4 mt-5 space-y-6 lg:ml-5">
        {/* Ongoing & Remaining Tasks */}
        <section className="bg-gray-100 shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Remaining / Ongoing Tasks:
          </h2>

          <div className="space-y-3">
            {/* Meetings */}
            <div>
              <h3 className="text-md font-medium text-gray-700">📅 Meetings</h3>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <Link
                  to={
                    qnsLen > 0
                      ? firstMeetingURL
                      : "/profile"
                  }
                >
                  <li>
                    <span className="font-medium text-gray-800">
                      <code>{qnsLen > 0 ? "Join Meet" : "You are already finished all meeting's..."}</code>
                    </span>
                  </li>
                </Link>
              </ul>
            </div>

            {/* Quiz OR Code Challenges */}
            <div>
              <h3 className="text-md font-medium text-gray-700">
                📝 Quiz / Code Challenges
              </h3>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <Link to={qnsLen > 0 ? "/devquiz" : "/profile"}>
                  <li>
                    <span className="font-medium text-gray-800">
                      <code>
                        {qnsLen > 0 ? "/devquiz" : "You are up to date now..."}
                      </code>
                    </span>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </section>

        {/* Dev Meet Recordings */}
        <DevMeetRecording videos={videos} />
      </aside>
    </div>
  );
};

export default Profile;
