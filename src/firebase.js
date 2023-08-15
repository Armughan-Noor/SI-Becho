// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAH2mlA2PEbLOz9fPfcP5B-VYhqAeoJ6SQ",
  authDomain: "becho-backend.firebaseapp.com",
  projectId: "becho-backend",
  storageBucket: "becho-backend.appspot.com",
  messagingSenderId: "684142224501",
  appId: "1:684142224501:web:1c1312663aad3db52ec43c",
  measurementId: "G-TZD7MMV104"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export {app, auth, db, storage};