import React from "react";
import styles from "../styles/Sidebar.module.scss";

function Sidebar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.item}> 1 </div>
        <div className={styles.item}> 2 </div>
        <div className={styles.item}> 3 </div>
      </div>
    </div>
  );
}

export default Sidebar;
