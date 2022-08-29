import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header/Header";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Sidebar />
    </>
  );
};

export default Login;
