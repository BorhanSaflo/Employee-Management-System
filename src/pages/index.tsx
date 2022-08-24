import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import Sidebar from "../components/Sidebar";
import styles from "@/styles/Home.module.scss";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    "example.hello",
    { text: "from tRPC" },
  ]);

  return (
    <>
      <Head>
        <title>Employee Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Sidebar />
        <h1 className={styles.title}>Employee Management System</h1>
        <div>{data ? <p>{data.greeting}</p> : <p>Loading..</p>}</div>
      </main>
    </>
  );
};

export default Home;
