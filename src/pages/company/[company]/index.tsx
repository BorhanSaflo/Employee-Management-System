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
                  <h1>{data.name}</h1>
                  <button className="dangerButton" onClick={deleteCompany}>
                    Delete Company
                  </button>
                </div>
                <em>Created {data.createdAt.toLocaleDateString()}</em>
                <div className={styles.employees}>
                  <div className={styles.employeeTitle}>
                    <h2>Employees</h2>
                    <button
                      className="button"
                      onClick={() => setIsModalOpen(!isModalOpen)}>
                      Add Employee
                    </button>
                  </div>
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
                          <td>{index + 1}</td>
                          <td>{employee.firstName}</td>
                          <td>{employee.lastName}</td>
                          <td>{employee.createdAt.toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>Total Employees: {data._count.employees}</p>
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
