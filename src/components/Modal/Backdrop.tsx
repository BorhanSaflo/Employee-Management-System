import { motion } from "framer-motion";
import styles from "@/styles/Modal.module.scss";
import { RemoveScrollBar } from "react-remove-scroll-bar";

const backdropTransition = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
};

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const Backdrop = ({ children, onClick }: Props) => {
  return (
    <motion.div
      onClick={onClick}
      className={styles.backdrop}
      variants={backdropTransition}
      initial="hidden"
      animate="visible"
      exit="exit">
      <RemoveScrollBar />
      {children}
    </motion.div>
  );
};

export default Backdrop;
