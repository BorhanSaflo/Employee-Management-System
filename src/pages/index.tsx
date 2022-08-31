import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import styles from "@/styles/Home.module.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Employee Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <div className={styles.wrapper}>
          <div>Hello World</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  };
}

export default Home;
