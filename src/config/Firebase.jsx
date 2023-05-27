// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABj-eYyqW8TJ5-f6kAJSAuG8aOekqL9Z0",
  authDomain: "courseexplorer-5f2ea.firebaseapp.com",
  databaseURL:
    "https://courseexplorer-5f2ea-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "courseexplorer-5f2ea",
  storageBucket: "courseexplorer-5f2ea.appspot.com",
  messagingSenderId: "74462000082",
  appId: "1:74462000082:web:ea23a10fcc72cfe0c00e0b",
  measurementId: "G-EV7SQZRJ6L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const coursesCollectionRef = collection(db, "courses");
