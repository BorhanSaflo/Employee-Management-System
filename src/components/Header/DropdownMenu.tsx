import React from "react";
import styles from "@/styles/Header.module.scss";

function DropdownMenu(props: any) {
  return <div className={styles.dropdownContainer}>{props.children}</div>;
}

export default DropdownMenu;
