import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/Header.module.scss";
import { getIcon } from "@/utils/getIcon";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  username: string | null | undefined;
  userProfilePicture: string;
  children?: React.ReactNode;
}

function Account({ children, username, userProfilePicture }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const DownArrow = getIcon("downArrow");

  const menuAnimation = {
    enter: {
      opacity: 1,
      translateY: 0,
      transition: {
        duration: 0.1,
      },
    },
    exit: {
      opacity: 0,
      translateY: -5,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <div className={styles.dropdownWrapper}>
      <div className={styles.account} onClick={() => setIsOpen(!isOpen)}>
        <Image
          src={userProfilePicture}
          className={styles.profilePicture}
          width={35}
          height={35}
          alt="profile"
        />
        <span>{username}</span>
        <DownArrow />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={"exit"}
            animate={"enter"}
            exit={"exit"}
            variants={menuAnimation}
            onMouseLeave={() => setIsOpen(false)}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Account;
