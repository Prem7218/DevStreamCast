import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, database } from "../../constantData/firebase";
import DetailsVarification from "../DetailsVarification";
import Spinner from "../../constantData/Spinner";
import { useDispatch } from "react-redux";
import { useauthCheck } from "../../3_context/authContext";
import { addProfile } from "../../constantData/Slices/profileSlice";
import { get, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, setName, email, setEmail, isSignUp, setIsSignUp } =
    useauthCheck();
  const [password, setPassword] = useState("");
  const [validMessage, setValidMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const validationCheck = DetailsVarification(email, password);
    if (validationCheck) {
      setValidMessage(validationCheck);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const newUserProfile = {
          id: uuidv4(),
          uid: user.uid,
          name: user.displayName || "No Name",
          email: user.email || "",
          title: "New User",
          mob_num: "+ 91 000-000-0000",
          location: "Not Provided",
          gender: "Not Specified",
          connections: [],
          connectionsCount: 0,
          backgroundImg: "https://iili.io/33hDzy7.png",
          profilePic: "https://iili.io/33jdF1e.png",
          bio: "This is a new user.",

          experience: [
            {
              company: "Not Specified",
              role: "Not Specified",
              startDate: "YYYY-MM-DD",
              endDate: "YYYY-MM-DD",
              description: "No experience details provided.",
              currentJob: false,
            },
          ],

          education: [
            {
              institution: "Not Specified",
              degree: "Not Specified",
              startYear: "YYYY",
              endYear: "YYYY",
              currentEducation: false,
            },
          ],

          skills: {
            programming: ["JavaScript", "Python"], // Default skills
            softSkills: ["Communication"],
            languages: ["English"],
          },

          solvedQuestions: {
            correct: 0,
            pending: 0,
            wrong: 0,
          },

          mcqAptiStats: {
            subjects: {
              Mathematics: 0,
              Reasoning: 0,
            },
          },

          activityLog: ["User created on " + new Date().toISOString()], // Log user creation time
          achievements: ["Welcome Badge"], // Default achievement

          ranking: {
            globalRank: 1000000, // Default rank (1 millionth)
            countryRank: 500000,
            points: 0,
          },

          savedQuestions: ["DSA Topic"],

          preferences: {
            theme: "dark",
            notifications: { email: true, push: false },
            language: "English",
          },
        };

        // Store full user data in Firebase
        await set(ref(database, `users/${user.uid}`), newUserProfile);

        dispatch(addProfile(newUserProfile));
        alert("Account created successfully!");
        navigate("/profile");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Signed in successfully!");
        navigate("/profile");
      }
    } catch (error) {
      setValidMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        const newUserProfile = {
          id: uuidv4(),
          uid: user.uid,
          name: user.displayName || "No Name",
          email: user.email || "",
          title: "New User",
          mob_num: "+ 91 000-000-0000",
          location: "Not Provided",
          gender: "Not Specified",
          connections: [],
          connectionsCount: 0,
          backgroundImg: "https://iili.io/33hDzy7.png",
          profilePic: "https://iili.io/33jdF1e.png",
          bio: "This is a new user.",

          experience: [
            {
              company: "Not Specified",
              role: "Not Specified",
              startDate: "YYYY-MM-DD",
              endDate: "YYYY-MM-DD",
              description: "No experience details provided.",
              currentJob: false,
            },
          ],

          education: [
            {
              institution: "Not Specified",
              degree: "Not Specified",
              startYear: "YYYY",
              endYear: "YYYY",
              currentEducation: false,
            },
          ],

          skills: {
            programming: ["JavaScript", "Python"], // Default skills
            softSkills: ["Communication"],
            languages: ["English"],
          },

          solvedQuestions: {
            correct: 0,
            pending: 0,
            wrong: 0,
          },

          mcqAptiStats: {
            subjects: {
              Mathematics: 0,
              Reasoning: 0,
            },
          },

          activityLog: ["User created on " + new Date().toISOString()], // Log user creation time
          achievements: ["Welcome Badge"], // Default achievement

          ranking: {
            globalRank: 1000000, // Default rank (1 millionth)
            countryRank: 500000,
            points: 0,
          },

          savedQuestions: ["DSA Topic"],

          preferences: {
            theme: "dark",
            notifications: { email: true, push: false },
            language: "English",
          },
        };

        await set(ref(database, `users/${user.uid}`), newUserProfile);
        dispatch(addProfile(newUserProfile));
      }

      alert("Signed in successfully!");
      navigate("/profile");
    } catch (error) {
      setValidMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 m-4">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          {isSignUp ? "Create Your Account" : "Existing Account (Sign In)"}
        </h2>
        <form onSubmit={handleEmailSignup}>
          {isSignUp && (
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {validMessage && (
          <p className="mt-4 text-red-500 text-sm font-medium">
            {validMessage}
          </p>
        )}

        {isLoading && <Spinner />}

        <div className="mt-3">
          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-600">
              or sign {isSignUp ? "Up" : "In"} with
            </span>
          </div>
          <button
            onClick={() => handleSocialSignUp(new GoogleAuthProvider())}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
          >
            <FcGoogle className="text-2xl" />
            <span>Sign {isSignUp ? "Up" : "In"} with Google</span>
          </button>
          <button
            onClick={() => handleSocialSignUp(new GithubAuthProvider())}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <FaGithub className="text-2xl" />
            <span>Sign {isSignUp ? "Up" : "In"} with GitHub</span>
          </button>
        </div>

        <hr />
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
        >
          <span className="text-gray-600">
            {isSignUp ? `Existing User Sign In Now` : `Create a New Account`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Login;
