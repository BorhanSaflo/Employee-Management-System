import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Sidebar from "../components/Sidebar";
import styles from "@/styles/Dashboard.module.scss";
import { useSession, getSession } from "next-auth/react";
import Header from "@/components/Header";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Sidebar />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Employee Management System</h1>
      </div>
    </>
  );
};

export default Home;
