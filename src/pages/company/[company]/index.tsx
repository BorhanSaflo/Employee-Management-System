import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { DefaultQueryCell } from "@/utils/DefaultQueryCell";
import styles from "@/styles/Company.module.scss";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar";

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
  };

  const deleteCompany = () =>
    deleteCompanyMutation.mutate(
      { id: companyId },
      {
        onSuccess: () => router.push("/dashboard"),
      }
    );

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
                      onClick={() => createEmployee("John", "Doe")}>
                      Add Employee
                    </button>
                  </div>
                  <table className={styles.employeesTable}>
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.employees.map((employee) => (
                        <tr
                          key={employee.id}
                          onClick={() =>
                            router.push(
                              `/company/${companyId}/employee/${employee.id}`
                            )
                          }>
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
