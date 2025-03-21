// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.THE_FIREBASE_API_KEY,
  authDomain: "devstreamcast.firebaseapp.com",
  databaseURL: "https://devstreamcast-default-rtdb.firebaseio.com/", // ✅ Ensure this is correct
  projectId: "devstreamcast",
  storageBucket: "devstreamcast.appspot.com", // ✅ Correct domain for storage
  // "devstreamcast.firebasestorage.app",
  messagingSenderId: "185427457574",
  appId: "1:185427457574:web:c1f778e671739a2f7c98e7",
  measurementId: "G-72TDZ0QW1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export default app;