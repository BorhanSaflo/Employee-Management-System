import React from "react";
import { getIcon } from "../utils/getIcon";
import styles from "../styles/Sidebar.module.scss";

function Sidebar() {
  const PlusIcon = getIcon("plus");
  const DashBoardIcon = getIcon("dashboard");
  const PersonListIcon = getIcon("personList");

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.item}>
          <PlusIcon />
        </div>
        <div className={styles.item}>
          <DashBoardIcon />
        </div>
        <div className={styles.item}>
          <PersonListIcon />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
