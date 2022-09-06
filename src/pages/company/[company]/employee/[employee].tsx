import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { DefaultQueryCell } from "@/utils/DefaultQueryCell";
import styles from "@/styles/Company.module.scss";
import Head from "next/head";
import Header from "@/components/Header/Header";

export default function Company() {
  const companyId = useRouter().query.company as string;
  const employeeId = useRouter().query.employee as string;
  const companyQuery = trpc.useQuery([
    "employee.byId",
    { id: employeeId, companyId: companyId },
  ]);

  return (
    <>
      <Header />
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
              <title>{`${data.firstName} ${data.lastName}`}</title>
            </Head>

            <main>
              <div className={styles.wrapper}>
                <h1>{`${data.firstName} ${data.lastName}`}</h1>
                <em>Joined {data.createdAt.toLocaleDateString()}</em>
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
