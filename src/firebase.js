// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAAmMxROBQCu9J59U2ZeKzDlBeU3a7bRsE",
  authDomain: "provia-platform.firebaseapp.com",
  projectId: "provia-platform",
  storageBucket: "provia-platform.firebasestorage.app",
  messagingSenderId: "503916799653",
  appId: "1:503916799653:web:a1b49f1f3a0c4e5fc10f4c"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);