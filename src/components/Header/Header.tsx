import React from "react";
import styles from "@/styles/Header.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Account from "./Account";
import DropdownMenu from "./DropdownMenu";
import ThemeChanger from "./ThemeChanger";

function Header() {
  const { data: session, status } = useSession();
  return (
    <div className={styles.wrapper}>
      <Link href={"/"} passHref>
        <a className={styles.title}>{"Employee Management System"}</a>
      </Link>
      <div className={styles.accountContainer}>
        {session ? (
          <>
            <Account
              username={session.user?.name}
              userProfilePicture={session.user?.image!}>
              <DropdownMenu>
                <a className="button" href="/dashboard">
                  Dashboard
                </a>
                <button className="button" onClick={() => signOut()}>
                  Sign out
                </button>
              </DropdownMenu>
            </Account>
          </>
        ) : (
          <button className="button" onClick={() => signIn("google")}>
            Sign in
          </button>
        )}
        <ThemeChanger />
      </div>
    </div>
  );
}

export default Header;
