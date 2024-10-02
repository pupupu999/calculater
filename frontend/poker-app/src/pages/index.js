import styles from "@/styles/style.module.css";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useRouter } from "next/router";

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

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Please login</h1>
          <button onClick={goToLogin}>Go to Login</button> {/* ボタンをクリックでloginページに遷移 */}
        </div>
      )}
    </div>
  );
}
