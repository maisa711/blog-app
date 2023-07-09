// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKnuXI10eVbwCu1XPkKODKs5kzU7x9TmA",
  authDomain: "blog-app-d5455.firebaseapp.com",
  projectId: "blog-app-d5455",
  storageBucket: "blog-app-d5455.appspot.com",
  messagingSenderId: "552679359248",
  appId: "1:552679359248:web:ffe974662380a026925b95",
  measurementId: "G-0Y4BVRDNG0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);