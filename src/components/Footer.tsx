import React from "react";
import styles from "../styles/Footer.module.scss";

function Footer() {
  return (
    <div className={styles.wrapper}>
      <span>
        © {new Date().getFullYear()} Borhan Saflo. All rights reserved.
      </span>
    </div>
  );
}

export default Footer;
