import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Sidebar from "../components/Sidebar";
import styles from "@/styles/Dashboard.module.scss";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Employee Management System</h1>
      </div>
    </>
  );
};

export default Home;
