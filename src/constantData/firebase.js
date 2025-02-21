// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkgYk_-xvmF9A_bp7w7PtRoK2OZ23ynoU",
  authDomain: "devstreamcast.firebaseapp.com",
  projectId: "devstreamcast",
  storageBucket: "devstreamcast.firebasestorage.app",
  messagingSenderId: "185427457574",
  appId: "1:185427457574:web:c1f778e671739a2f7c98e7",
  measurementId: "G-72TDZ0QW1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();