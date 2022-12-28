import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/Dropdown.module.scss";

interface Props {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  closeOnMouseLeave?: boolean;
}

function Dropdown({ children, isOpen, setIsOpen, closeOnMouseLeave }: Props) {
  const menuAnimation = {
    enter: {
      opacity: 1,
      transition: {
        duration: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <div className={styles.dropdownWrapper} onClick={() => setIsOpen(!isOpen)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={"exit"}
            animate={"enter"}
            exit={"exit"}
            variants={menuAnimation}
            onMouseLeave={
              closeOnMouseLeave ? () => setIsOpen(false) : undefined
            }>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
