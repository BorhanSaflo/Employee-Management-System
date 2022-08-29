import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Dashboard.module.scss";
import { useSession, getSession } from "next-auth/react";
import Header from "@/components/Header/Header";

const Dashboard: NextPage = ({ session }: any) => {
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

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Dashboard;
