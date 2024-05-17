import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import LoginCard from '../components/molecules/cards/loginCard/loginCard';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { useIsMobile } from '../hooks/useIsMobile';
import { NextPageWithLayout } from './page';

const LoginPage: NextPageWithLayout = () => {

  const isMobile = useIsMobile()

  return (
    <>
      <div className={isMobile ? `md:flex md:flex-col min-h-screen justify-between` : ''}>
        <Header />
        <div className="flex justify-center items-center mt-32 lg:mb-20">
          <LoginCard />
        </div>
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getSession(context)) as any;

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
