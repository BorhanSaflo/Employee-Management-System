import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "@/components/Modal/Backdrop";
import styles from "@/styles/Modal.module.scss";
import { getIcon } from "@/utils/getIcon";

const modalTransition = {
  hidden: {
    y: "20px",
    opacity: 0,
  },
  visible: {
    y: "0px",
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    y: "20px",
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
};

interface Props {
  status: boolean;
  handleClose: () => void;
  children?: React.ReactNode;
  title: string;
}

const Modal = ({ status, handleClose, children, title }: Props) => {
  const CloseIcon = getIcon("close");

  return (
    <AnimatePresence
      initial={false}
      exitBeforeEnter={true}
      onExitComplete={() => null}>
      {status && (
        <Backdrop onClick={handleClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className={styles.modal}
            variants={modalTransition}
            initial="hidden"
            animate="visible"
            exit="exit">
            <div className={styles.header}>
              <div className={styles.title}>{title}</div>
              <CloseIcon className={styles.closeButton} onClick={handleClose} />
            </div>
            <div className={styles.body}>{children}</div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default Modal;
