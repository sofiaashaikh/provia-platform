// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  // Replace these with the keys from your Firebase Web App settings
  apiKey: "YOUR_API_KEY",
  authDomain: "provia-platform.firebaseapp.com",
  databaseURL: "https://provia-platform-default-rtdb.firebaseio.com/", 
  projectId: "provia-platform",
  storageBucket: "provia-platform.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);