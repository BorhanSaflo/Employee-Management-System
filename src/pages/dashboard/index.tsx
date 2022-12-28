import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Dashboard.module.scss";
import modalStyles from "@/styles/Modal.module.scss";
import dropdownStyles from "@/styles/Dropdown.module.scss";
import { getSession } from "next-auth/react";
import Header from "@/components/Header/Header";
import { getIcon } from "@/utils/getIcon";
import Modal from "@/components/Modal/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import { DefaultQueryCell } from "@/utils/DefaultQueryCell";
import Dropdown from "@/components/Dropdown/Dropdown";
import Option from "@/components/Dropdown/Option";

const Dashboard: NextPage = ({ session }: any) => {
  const router = useRouter();

  // Companies Handling
  const companiesQuery = trpc.useQuery(["company.getAll"]);
  const { refetch: refetchCompanies } = companiesQuery;
  const createCompanyMutation = trpc.useMutation(["company.create"]);

  const createCompany = (
    name: string,
    themeColor?: string,
    textColor?: string
  ) => {
    createCompanyMutation.mutate(
      { name, themeColor, textColor },
      { onSuccess: () => refetchCompanies() }
    );
    closeModal();
  };

  const closeModal = () => {
    setCompanyNameInput("");
    setCompanyThemeColor("");
    setSelectedColorName("");
    setSelectedColorCode("");
    setCompanyTextColor("");
    setIsOpen(false);
    setIsModalOpen(false);
  };

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [companyThemeColor, setCompanyThemeColor] = useState("");
  const [companyTextColor, setCompanyTextColor] = useState("");
  const [selectedColorName, setSelectedColorName] = useState("");
  const [selectedColorCode, setSelectedColorCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const DownArrow = getIcon("downArrow");
  const EmployeesIcon = getIcon("group");

  const setColor = (name: string, code: string, textCode: string) => {
    setSelectedColorName(name);
    setSelectedColorCode(code);
    setCompanyThemeColor(code);
    setCompanyTextColor(textCode);
  };

  const colors = [
    { name: "Orange", code: "#FBECDD", textCode: "#D97319" },
    { name: "Yellow", code: "#FBF3DB", textCode: "#D1A14B" },
    { name: "Green", code: "#EDF3EC", textCode: "#448361" },
    { name: "Blue", code: "#E5F0F9", textCode: "#3880AB" },
    { name: "Purple", code: "#F2E9F9", textCode: "#976FB5" },
    { name: "Pink", code: "#FCECF9", textCode: "#C14C8A" },
    { name: "Red", code: "#FCECEC", textCode: "#D44C47" },
  ];

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
            <DefaultQueryCell
              query={companiesQuery}
              loading={() => (
                <>
                  <div>Loading...</div>
                </>
              )}
              success={({ data }) => (
                <>
                  {data?.map((company) => (
                    <motion.li
                      key={company.id}
                      className={styles.company}
                      style={
                        company.themeColor
                          ? {
                              backgroundColor: company.themeColor!,
                              borderColor: company.textColor!,
                            }
                          : {}
                      }
                      variants={itemTransition}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      onClick={() => router.push(`/company/${company.id}`)}>
                      <div
                        className={styles.companyName}
                        style={
                          company.textColor
                            ? {
                                color: company.textColor!,
                              }
                            : {}
                        }>
                        <div>{company.name}</div>
                        <div className={styles.employeesCounterContainer}>
                          <EmployeesIcon />
                          {company._count.employees}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                  <motion.li
                    className={`${styles.company} ${styles.addCompany}`}
                    variants={itemTransition}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    onClick={() => setIsModalOpen(!isModalOpen)}>
                    <AddIcon className={styles.addIcon} />
                    <span>Add Company</span>
                  </motion.li>
                </>
              )}
            />
          </AnimatePresence>
        </ul>
        <Modal
          status={isModalOpen}
          handleClose={closeModal}
          title={"Add Company"}>
          <div className={modalStyles.form}>
            <label className={modalStyles.label}>
              Company Name
              <input
                type="text"
                minLength={1}
                maxLength={20}
                value={companyNameInput}
                onChange={(e) => {
                  setCompanyNameInput(e.target.value);
                }}
              />
            </label>
            <label className={modalStyles.label}>
              Color
              <div
                className={dropdownStyles.optionContainer}
                onClick={() => setIsOpen(!isOpen)}>
                <div className={dropdownStyles.option}>
                  <div
                    className={dropdownStyles.optionColor}
                    style={
                      selectedColorCode
                        ? { backgroundColor: selectedColorCode }
                        : {}
                    }></div>
                  <div className={dropdownStyles.selectedText}>
                    {selectedColorName ? selectedColorName : "Select Color"}
                  </div>
                </div>
                <DownArrow className={dropdownStyles.downArrow} />
              </div>
              <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className={dropdownStyles.container}>
                  <div className={dropdownStyles.options}>
                    {colors.map((color) => (
                      <Option
                        key={color.code}
                        onClick={() =>
                          setColor(color.name, color.code, color.textCode)
                        }
                        colorName={color.name}
                        colorCode={color.code}
                      />
                    ))}
                  </div>
                </div>
              </Dropdown>
            </label>
          </div>
          <div className="centerRow">
            <button
              className="button"
              onClick={() =>
                createCompany(
                  companyNameInput,
                  companyThemeColor,
                  companyTextColor
                )
              }>
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
