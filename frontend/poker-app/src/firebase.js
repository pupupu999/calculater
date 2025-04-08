// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMk0kAviY_ctOxnfyJQIOQV_PH__9dI1s",
  authDomain: "my-project-30c6b.firebaseapp.com",
  projectId: "my-project-30c6b",
  storageBucket: "my-project-30c6b.appspot.com",
  messagingSenderId: "592344671624",
  appId: "1:592344671624:web:006da4f6eee1603e13c63d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestoreのデータベース取得
export const db = getFirestore(app);

// Firebaseの認証機能取得
export const auth = getAuth(app);

// Google認証プロバイダ
export const googleProvider = new GoogleAuthProvider();