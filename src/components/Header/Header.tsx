import React from "react";
import styles from "@/styles/Header.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Account from "./Account";
import DropdownMenu from "./DropdownMenu";
import ThemeChanger from "./ThemeChanger";
import { getIcon } from "@/utils/getIcon";
import { fullWidthClassName } from "react-remove-scroll-bar";

function Header() {
  const { data: session, status } = useSession();
  const Logo = getIcon("group");
  const SignOutIcon = getIcon("signOut");

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.container} ${fullWidthClassName}`}>
        <Link href={"/"} passHref>
          <a className={styles.title}>
            <Logo className={styles.logo} />
            Employee Management System
          </a>
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
                  <button className="dangerButton" onClick={() => signOut()}>
                    <SignOutIcon />
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
    </div>
  );
}

export default Header;
