import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../Components/Sidebar";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Employee Management System</title>
      </Head>

      <main className={styles.main}>
        <Sidebar />
        <h1 className={styles.title}>Employee Management System</h1>
      </main>
    </div>
  );
};

export default Home;
