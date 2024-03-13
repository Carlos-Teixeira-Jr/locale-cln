import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";


const Test = () => {
  return (
    <div>
      Teste
    </div>
  )
}

export default Test

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  console.log("🚀 ~ getServerSideProps ~ session:", session)

  if (!session) {
    return {
      redirect: {
        destination: '/announcement',
        permanent: false,
      },
    };
  }

  return {
    props: {

    }
  }
}