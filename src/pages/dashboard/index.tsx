import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Dashboard.module.scss";
import { useSession, getSession } from "next-auth/react";
import Header from "@/components/Header/Header";
import { getIcon } from "@/utils/getIcon";

const Dashboard: NextPage = ({ session }: any) => {
  const {
    data: companies,
    refetch: refetchCompanies,
    isFetching,
  } = trpc.useQuery(["company.getAll"], {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const createCompanyMutation = trpc.useMutation(["company.create"]);
  const deleteCompanyMutation = trpc.useMutation(["company.delete"]);
  const AddIcon = getIcon("add");

  const deleteCompany = async (id: string) => {
    await deleteCompanyMutation.mutate(
      { id },
      {
        onSuccess: () => refetchCompanies(),
      }
    );
  };

  const createCompany = (name: string) => {
    createCompanyMutation.mutate(
      { name },
      {
        onSuccess: () => refetchCompanies(),
      }
    );
  };

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
          {companies?.map((company) => (
            <div
              key={company.id}
              className={styles.company}
              onClick={() => deleteCompany(company.id)}>
              <div className={styles.companyName}>
                <div>{company.name}</div>
                <div>Employees: {company._count.employees}</div>
              </div>
            </div>
          ))}
          <div
            className={styles.company}
            onClick={() =>
              createCompany(`Company #${Math.floor(Math.random() * 1000)}`)
            }>
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
