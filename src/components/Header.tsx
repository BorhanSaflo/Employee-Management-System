import React from "react";
import styles from "@/styles/Header.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

function Header() {
  const { data: session, status } = useSession();
  return (
    <div className={styles.wrapper}>
      <span>Employee Management System</span>
      <div className={styles.accountContainer}>
        {session ? (
          <>
            <span>{session.user?.name}</span>
            <Image
              src={session.user?.image!}
              className={styles.profilePicture}
              width={40}
              height={40}
              alt="profile"
            />
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
