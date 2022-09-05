import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Dashboard.module.scss";
import { getSession } from "next-auth/react";
import Header from "@/components/Header/Header";
import { getIcon } from "@/utils/getIcon";
import Modal from "@/components/Modal/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";

const Dashboard: NextPage = ({ session }: any) => {
  const router = useRouter();

  // Companies Handling
  const {
    data: companies,
    refetch: refetchCompanies,
    isFetching,
  } = trpc.useQuery(["company.getAll"], {
    refetchInterval: false,
  });

  const createCompanyMutation = trpc.useMutation(["company.create"]);
  const deleteCompanyMutation = trpc.useMutation(["company.delete"]);

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
    close();
    setCompanyName("");
  };

  //Modal
  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [companyName, setCompanyName] = useState("");

  // Animation
  const itemTransition = {
    hidden: {
      scale: 0.5,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "linear",
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "linear",
      },
    },
  };

  //Icons
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
        <ul className={styles.companiesContainer}>
          <AnimatePresence>
            {companies?.map((company) => (
              <motion.li
                key={company.id}
                className={styles.company}
                variants={itemTransition}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                onClick={() =>
                  router.push(`/company/${company.name.replace(/\#/g, "%23")}`)
                }>
                <div className={styles.companyName}>
                  <div>{company.name}</div>
                  <div>Employees: {company._count.employees}</div>
                </div>
              </motion.li>
            ))}
            <motion.li
              className={styles.company}
              variants={itemTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              onClick={() => (modalOpen ? close() : open())}>
              <AddIcon className={styles.addIcon} />
              <span>Add Company</span>
            </motion.li>
          </AnimatePresence>
        </ul>
        <Modal status={modalOpen} handleClose={close} title={"Add Company"}>
          <label className={styles.label} htmlFor="companyName">
            Company Name
            <input
              type="text"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
              }}
            />
          </label>
          <div className="centerRow">
            <button
              className="button"
              onClick={() => createCompany(companyName)}>
              Add Company
            </button>
          </div>
        </Modal>
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
