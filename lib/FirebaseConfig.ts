// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "shortgen-a1712.firebaseapp.com",
  projectId: "shortgen-a1712",
  storageBucket: "shortgen-a1712.firebasestorage.app",
  messagingSenderId: "119578822766",
  appId: "1:119578822766:web:1239aff67aa60e5fe7fe7f",
  measurementId: "G-H85M1PY21K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)