import React from "react";
import styles from "@/styles/Header.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";

function Header() {
  const { data: session, status } = useSession();
  return (
    <div className={styles.wrapper}>
      <span>Employee Management System</span>
      <div className={styles.accountContainer}>
        {session ? (
          <>
            <p>hi {session.user?.name}</p>
            <button className={styles.button} onClick={() => signOut()}>
              Logout
            </button>
          </>
        ) : (
          <button className={styles.button} onClick={() => signIn("google")}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
