import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/Header.module.scss";
import { getIcon } from "@/utils/getIcon";

interface Props {
  username: string | null | undefined;
  userProfilePicture: string;
  children?: React.ReactNode;
}

function Account({ children, username, userProfilePicture }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const RightArrow = getIcon("rightArrow");

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.account} onClick={() => setIsOpen(!isOpen)}>
        <Image
          src={userProfilePicture}
          className={styles.profilePicture}
          width={40}
          height={40}
          alt="profile"
        />
        <span>{username}</span>
        <RightArrow />
      </div>
      {isOpen && children}
    </div>
  );
}

export default Account;
