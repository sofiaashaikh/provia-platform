// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // Added for Login

const firebaseConfig = {
  apiKey: "AIzaSyAAmMxROBQCu9J59U2ZeKzDlBeU3a7bRsE",
  authDomain: "provia-platform.firebaseapp.com",
  projectId: "provia-platform",
  storageBucket: "provia-platform.firebasestorage.app", 
  messagingSenderId: "503916799653",
  appId: "1:503916799653:web:a1b49f1f3a0c4e5fc10f4c",
  databaseURL: "https://provia-platform-default-rtdb.firebaseio.com/" 
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app); // Added to export the Auth service