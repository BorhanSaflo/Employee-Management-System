import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Dashboard.module.scss";
import { useSession, getSession } from "next-auth/react";
import Header from "@/components/Header/Header";
import { getIcon } from "@/utils/getIcon";

const Dashboard: NextPage = ({ session }: any) => {
  const { data: companies, isLoading } = trpc.useQuery(["company.getAll"]);
  const AddIcon = getIcon("add");

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Sidebar />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Companies</h1>
        <div className={styles.companiesContainer}>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            companies?.map((company: any) => (
              <div key={company.id} className={styles.company}>
                <div className={styles.companyName}>{company.name}</div>
              </div>
            ))
          )}
          <div className={styles.company}>
            <AddIcon className={styles.addIcon} />
            <span>Add Company</span>
          </div>
        </div>
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
