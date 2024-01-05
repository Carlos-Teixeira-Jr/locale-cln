import jwt, { JwtPayload } from 'jsonwebtoken';
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
      <div>
        <div className="flex justify-center items-center mt-24">
          <LoginCard />
        </div>
      </div>
      <Footer smallPage={false} />
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
  } else {
    token = session.user?.data.access_token!!;
    refreshToken = session.user?.data.refresh_token;
    const decodedToken = jwt.decode(token) as JwtPayload;
    const isTokenExpired = decodedToken?.exp
      ? decodedToken?.exp <= Math.floor(Date.now() / 1000)
      : false;

    if (isTokenExpired) {
      const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
      const isRefreshTokenExpired = decodedRefreshToken?.exp
        ? decodedRefreshToken?.exp <= Math.floor(Date.now() / 1000)
        : false;

      if (isRefreshTokenExpired) {
        return {
          props: {},
        };
      } else {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refresh_token: refreshToken,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const newToken = data.access_token;
            const newRefreshToken = data.refresh_token;
            refreshToken = newRefreshToken;
            session.user.data.refresh_token = newRefreshToken;
            token = newToken;
            session.user.data.access_token = newToken;

            return {
              redirect: {
                destination: '/admin&page=1',
                permanent: false,
              },
            };
          } else {
            console.log('erro na chamada');
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return {
      redirect: {
        destination: '/admin?page=1',
        permanent: false,
      },
    };
  }
};

export default LoginPage;
