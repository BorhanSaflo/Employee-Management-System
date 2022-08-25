import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "@/styles/Home.module.scss";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const { data, isLoading } = trpc.useQuery([
    "example.hello",
    { text: "from tRPC" },
  ]);

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <>
      <Head>
        <title>Employee Management System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.wrapper}>
          <div>{data ? <p>{data.greeting}</p> : <p>Loading..</p>}</div>
          {session ? (
            <div>
              <p>hi {session.user?.name}</p>

              <button onClick={() => signOut()}>Logout</button>
            </div>
          ) : (
            <div>
              <button onClick={() => signIn("google")}>Login</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
