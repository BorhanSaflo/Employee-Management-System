import React from "react";
import styles from "@/styles/Dropdown.module.scss";

interface Props {
  colorName: string;
  colorCode: string;
  onClick: () => void;
}

function Option({ colorName, colorCode, onClick }: Props) {
  return (
    <div className={styles.optionContainer} onClick={onClick}>
      <div className={styles.option}>
        <div
          className={styles.optionColor}
          style={{ backgroundColor: colorCode }}></div>
        <div>{colorName}</div>
      </div>
    </div>
  );
}

export default Option;
