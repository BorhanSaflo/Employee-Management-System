import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { DefaultQueryCell } from "@/utils/DefaultQueryCell";
import styles from "@/styles/Company.module.scss";
import modalStyles from "@/styles/Modal.module.scss";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { getIcon } from "@/utils/getIcon";

export default function Company() {
  const router = useRouter();
  const companyId = useRouter().query.company as string;
  const companyQuery = trpc.useQuery(["company.byId", { id: companyId }]);
  const deleteCompanyMutation = trpc.useMutation(["company.delete"]);
  const createEmployeeMutation = trpc.useMutation(["employee.create"]);

  const createEmployee = (firstName: string, lastName: string) => {
    createEmployeeMutation.mutate(
      { firstName, lastName, companyId },
      { onSuccess: () => companyQuery.refetch() }
    );
    closeModal();
    setFirstNameInput("");
    setLastNameInput("");
  };

  const deleteCompany = () =>
    deleteCompanyMutation.mutate(
      { id: companyId },
      {
        onSuccess: () => router.push("/dashboard"),
      }
    );

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  // Icons
  const AddIcon = getIcon("add");
  const CalendarIcon = getIcon("calendar");
  const GroupIcon = getIcon("group");
  const TrashIcon = getIcon("trash");

  return (
    <>
      <Header />
      <Sidebar />
      <DefaultQueryCell
        query={companyQuery}
        loading={() => (
          <>
            <Head>
              <title>{"Loading..."}</title>
            </Head>
            <div>Loading...</div>
          </>
        )}
        success={({ data }) => (
          <>
            <Head>
              <title>{data.name}</title>
            </Head>

            <main>
              <div className={styles.wrapper}>
                <div className={styles.companyHeader}>
                  <div className={styles.companyNameContainer}>
                    <div className={styles.title}>Company Name</div>
                    <div className={styles.companyName}>{data.name}</div>
                  </div>
                  <button className="dangerButton" onClick={deleteCompany}>
                    <TrashIcon />
                    Delete Company
                  </button>
                </div>
                <div className={styles.sectionRow}>
                  <div className={styles.infoBox}>
                    <GroupIcon
                      style={{
                        fontSize: "2.4rem",
                      }}
                      className={styles.infoBoxIcon}
                    />
                    <div className={styles.infoBoxText}>
                      <span className={styles.infoBoxTitle}>
                        Total Employees
                      </span>
                      {data._count.employees}
                    </div>
                  </div>
                  <div className={styles.infoBox}>
                    <CalendarIcon
                      style={{
                        fontSize: "1.8rem",
                      }}
                      className={styles.infoBoxIcon}
                    />
                    <div className={styles.infoBoxText}>
                      <span className={styles.infoBoxTitle}>Created</span>
                      {data.createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className={styles.employees}>
                  <div className={styles.employeeTitle}>
                    <h2>Employees</h2>
                    <button
                      className="successButton"
                      onClick={() => setIsModalOpen(!isModalOpen)}>
                      <AddIcon
                        style={{
                          fontSize: "1.2rem",
                        }}
                      />
                      New Employee
                    </button>
                  </div>
                  <div className={styles.tableWrapper}>
                    <table className={styles.employeesTable}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.employees.map((employee, index) => (
                          <tr
                            key={employee.id}
                            onClick={() =>
                              router.push(
                                `/company/${companyId}/employee/${employee.id}`
                              )
                            }>
                            <td className={styles.secondary}>{index + 1}</td>
                            <td className={styles.primary}>
                              {employee.firstName}
                            </td>
                            <td className={styles.primary}>
                              {employee.lastName}
                            </td>
                            <td className={styles.secondary}>
                              {employee.createdAt.toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <Modal
                status={isModalOpen}
                handleClose={closeModal}
                title={"Add Employee"}>
                <label className={modalStyles.label}>
                  First Name
                  <input
                    type="text"
                    value={firstNameInput}
                    onChange={(e) => {
                      setFirstNameInput(e.target.value);
                    }}
                  />
                </label>
                <label className={modalStyles.label}>
                  Last Name
                  <input
                    type="text"
                    value={lastNameInput}
                    onChange={(e) => {
                      setLastNameInput(e.target.value);
                    }}
                  />
                </label>
                <div className="centerRow">
                  <button
                    className="button"
                    onClick={() =>
                      createEmployee(firstNameInput, lastNameInput)
                    }>
                    Add Employee
                  </button>
                </div>
              </Modal>
            </main>
          </>
        )}
      />
    </>
  );
}

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
