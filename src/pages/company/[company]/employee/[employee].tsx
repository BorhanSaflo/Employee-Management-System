import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { DefaultQueryCell } from "@/utils/DefaultQueryCell";
import styles from "@/styles/Employee.module.scss";
import modalStyles from "@/styles/Modal.module.scss";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar";
import { getIcon } from "@/utils/getIcon";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";

export default function Company() {
  const router = useRouter();

  // Query
  const companyId = useRouter().query.company as string;
  const employeeId = useRouter().query.employee as string;
  const employeeQuery = trpc.useQuery([
    "employee.byId",
    { id: employeeId, companyId: companyId },
  ]);
  const deleteEmployeeMutation = trpc.useMutation(["employee.delete"]);
  const taskCreationMutation = trpc.useMutation("task.create");

  const deleteEmployee = () =>
    deleteEmployeeMutation.mutate(
      { id: employeeId },
      {
        onSuccess: () => router.push(`/company/${companyId}`),
      }
    );

  const createTask = async (title: string, description?: string) => {
    taskCreationMutation.mutate(
      { title, description, employeeId },
      { onSuccess: () => employeeQuery.refetch() }
    );
    closeModal();
    setTaskTitleInput("");
    setTaskDescriptionInput("");
  };

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [taskTitleInput, setTaskTitleInput] = useState("");
  const [taskDescriptionInput, setTaskDescriptionInput] = useState("");

  // Icons
  const AddIcon = getIcon("add");
  const CalendarIcon = getIcon("calendar");
  const TaskListIcon = getIcon("taskList");
  const TrashIcon = getIcon("trash");

  return (
    <>
      <Header />
      <Sidebar />
      <DefaultQueryCell
        query={employeeQuery}
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
              <title>{`${data.firstName} ${data.lastName}`}</title>
            </Head>

            <main>
              <div className={styles.wrapper}>
                <div className={styles.companyHeader}>
                  <div className={styles.companyNameContainer}>
                    <div className={styles.title}>Employee Full Name</div>
                    <div
                      className={
                        styles.companyName
                      }>{`${data.firstName} ${data.lastName}`}</div>
                  </div>
                  <button className="dangerButton" onClick={deleteEmployee}>
                    <TrashIcon />
                    Delete Employee
                  </button>
                </div>
                <div className={styles.sectionRow}>
                  <div className={styles.infoBox}>
                    <TaskListIcon
                      style={{
                        fontSize: "2.4rem",
                      }}
                      className={styles.infoBoxIcon}
                    />
                    <div className={styles.infoBoxText}>
                      <span className={styles.infoBoxTitle}>Total Tasks</span>
                      {data._count.tasks}
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
                      <span className={styles.infoBoxTitle}>Joined</span>
                      {data.createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div className={styles.tasks}>
                  <div className={styles.tasksTitle}>
                    <h2>Tasks</h2>
                    <button
                      className="successButton"
                      onClick={() => setIsModalOpen(!isModalOpen)}>
                      <AddIcon
                        style={{
                          fontSize: "1.2rem",
                        }}
                      />
                      New Task
                    </button>
                  </div>
                  <div className={styles.tableWrapper}>
                    <table className={styles.tasksTable}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Status</th>
                          <th>Task</th>
                          <th>Description</th>
                          <th>Created On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.tasks.map((task, index) => (
                          <tr key={task.id}>
                            <td className={styles.secondary}>{index + 1}</td>
                            <td className={styles.secondary}>
                              {task.completed ? (
                                <span className={styles.completed}>
                                  Completed
                                </span>
                              ) : (
                                <span className={styles.pending}>Pending</span>
                              )}
                            </td>
                            <td className={styles.primary}>{task.title}</td>
                            <td className={styles.secondary}>
                              {task.description}
                            </td>
                            <td className={styles.secondary}>
                              {task.createdAt.toLocaleString("en-US", {
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
                title={"Add Task"}>
                <label className={modalStyles.label}>
                  Task Title
                  <input
                    type="text"
                    value={taskTitleInput}
                    onChange={(e) => {
                      setTaskTitleInput(e.target.value);
                    }}
                  />
                </label>
                <label className={modalStyles.label}>
                  Task Description
                  <textarea
                    value={taskDescriptionInput}
                    onChange={(e) => {
                      setTaskDescriptionInput(e.target.value);
                    }}
                  />
                </label>
                <div className="centerRow">
                  <button
                    className="button"
                    onClick={() =>
                      createTask(
                        taskTitleInput,
                        taskDescriptionInput.length > 0
                          ? taskDescriptionInput
                          : undefined
                      )
                    }>
                    Add Task
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
