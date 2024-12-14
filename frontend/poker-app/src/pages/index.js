import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useRouter } from "next/router";
import Header from '@/components/Header';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

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
    signOut(auth).then(() => {
      console.log("Logged out");
    }).catch((error) => {
      console.error("Error during logout:", error);
    });
  };

  const handleNavigation = (path) => {
    router.push(path);
  }

  return (
    <div className = {styles.titleBackground}>
      <Header />
      <div className = {styles.titleContent}>
        <button className = {styles.titleButton} onClick={() => handleNavigation('/login')}>Login</button>
      </div>
    </div>
  );
};