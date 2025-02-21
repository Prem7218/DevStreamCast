import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../constantData/firebase";
import DetailsVarification from "./DetailsVarification";
import Spinner from "../constantData/Spinner";
import { useParams } from "react-router-dom";
import { PHOTO_URL } from "../constantData/url_icons";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validMessage, setValidMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleEmailSignup = async (e) => {
    e.preventDefault(); // Prevent form submission
    setIsLoading(true);

    const validationCheck = DetailsVarification(email, password);
    setValidMessage(validationCheck);

    if (isSignUp) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: name,
          photoURL: PHOTO_URL,
        })
          .then(() => {
            const { uid, email, displayName, photoURL } = auth.currentUser;
            // Dispatch
          })
          .catch((error) => {
            setValidMessage(error.message);
          });
        alert("Account created successfully!");
      } catch (error) {
        setValidMessage(error.code + ": " + error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        ).then(() => {
          alert("Sign In successfully!");
        });
        const user = userCredential.user;
      } catch (error) {
        setValidMessage(error.code + ": " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Signed in with Google!");
    } catch (err) {
      setValidMessage(err.message);
    }
  };

  const handleGithubSignup = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Signed in with GitHub!");
    } catch (err) {
      setValidMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
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
            <span className="text-gray-600">or sign {isSignUp ? "Up" : "In"} with</span>
          </div>
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
          >
            <FcGoogle className="text-2xl" />
            <span>Sign {isSignUp ? "Up" : "In"} with Google</span>
          </button>
          <button
            onClick={handleGithubSignup}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <FaGithub className="text-2xl" />
            <span>Sign {isSignUp ? "Up" : "In"} with GitHub</span>
          </button>
        </div>

        <hr/>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer">
          <span className="text-gray-600">{isSignUp ? `Existing User Sign In Now` : `Create a New Account`}</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
