import styles from "../styles/style.module.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase.js"; // firebaseファイルの正しいパスを指定
import Header from "../components/Header.js";
import Login from "./login.js";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

// Homeコンポーネント
function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.titleBackground}>
      <Header />
      <div className={styles.titleContent}>
        <button className={styles.titleButton} onClick={() => handleNavigation("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}