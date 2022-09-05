import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { DefaultQueryCell } from "@/utils/DefaultQueryCell";
import Head from "next/head";
import Header from "@/components/Header/Header";

export default function Company() {
  const name = useRouter().query.companyName as string;
  const companyQuery = trpc.useQuery(["company.byName", { name }]);

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
              <title>{data.name}</title>
            </Head>

            <main>
              <h1>{data.name}</h1>
              <p>{data.name}</p>
              <em>Created {data.createdAt.toLocaleDateString()}</em>
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
