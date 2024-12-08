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

  const goToLogin = () => {
    router.push("/login");
  };

  const goToCreateRoom = () => {
    router.push("/CreateRoom");
  }

  return (
    <div>
      {user ? (
        <div className={styles.background}>
          <Header />
          <div>
            <h1>Welcome, {user.displayName}</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={goToCreateRoom}>Create Room</button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Please login</h1>
          <div className = {styles.loginloc}>
            <button className = {styles.loginbutton} onClick={goToLogin}>Login</button> 
          </div>
        </div>
      )}
    </div>
  );
}
