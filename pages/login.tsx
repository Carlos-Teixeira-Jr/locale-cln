import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import LoginCard from '../components/molecules/cards/loginCard/loginCard';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { NextPageWithLayout } from './page';

const LoginPage: NextPageWithLayout = () => {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center mt-40">
        <LoginCard />
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getSession(context)) as any;

  let token;
  let refreshToken;

  if (!session) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: '/admin?page=1',
      permanent: false,
    },
  };
};

export default LoginPage;
