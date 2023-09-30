import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { NextPageWithLayout } from './page';
import LoginCard from '../components/molecules/cards/loginCard/loginCard';
import jwt, { JwtPayload } from 'jsonwebtoken';

const LoginPage: NextPageWithLayout = () => {

  return (
    <>
      <div className="">
        <Head>
          <title>Locale | Login</title>
          <link rel="icon" href="/favicon.png" type="image/png" />
          <meta property="og:login" content="Login page" key="login" />
        </Head>
        <Header />
        <div className="flex-grow">
          {/* <Button onClick={() => signIn('google')}>Sign in</Button> */}
          <div className="flex justify-center mt-5 md:mt-[17px]">
            <LoginCard />
          </div>

          <div>
            <Footer smallPage={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context) as any;

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
    const isTokenExpired = decodedToken.exp
      ? decodedToken.exp <= Math.floor(Date.now() / 1000)
      : false;
    
    if (isTokenExpired) {
      const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
      const isRefreshTokenExpired = decodedRefreshToken.exp
        ? decodedRefreshToken.exp <= Math.floor(Date.now() / 1000)
        : false;

      if (isRefreshTokenExpired) {
        return {
          props: {}
        }
      } else {
        try {
          const response = await fetch('http://localhost:3001/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refresh_token: refreshToken
            })
          });

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
                destination: '/admin',
                permanent: false,
              },
            };
          } else {
            console.log("erro na chamada");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context) as any;
//   console.log("🚀 ~ file: login.tsx:41 ~ constgetServerSideProps:GetServerSideProps= ~ session:", session)
//   const provider = session?.user?.provider;
//   let token;
//   let refreshToken;

//   if (!session) {
//     return {
//       props: {},
//     };
//   } else {
//     if (provider === 'locale') {
//       token = session.user?.token!!;
//       refreshToken = session.user?.refreshToken;
//       const decodedToken = jwt.decode(token) as JwtPayload;
//       const isTokenExpired = decodedToken.exp
//         ? decodedToken.exp <= Math.floor(Date.now() / 1000)
//         : false;
      
//       if (isTokenExpired) {
//         const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
//         const isRefreshTokenExpired = decodedRefreshToken.exp
//           ? decodedRefreshToken.exp <= Math.floor(Date.now() / 1000)
//           : false;

//         if (isRefreshTokenExpired) {
//           return {
//             props: {}
//           }
//         } else {
//           try {
//             const response = await fetch('http://localhost:3001/auth/refresh', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({
//                 refresh_token: refreshToken
//               })
//             });

//             if (response.ok) {
//               const data = await response.json();
//               const newToken = data.access_token;
//               const newRefreshToken = data.refresh_token;
//               refreshToken = newRefreshToken;
//               session.user.data.refresh_token = newRefreshToken;
//               token = newToken;
//               session.user.data.access_token = newToken;

//               return {
//                 redirect: {
//                   destination: '/admin',
//                   permanent: false,
//                 },
//               };
//             } else {
//               console.log("erro na chamada");
//             }
//           } catch (error) {
//             console.log(error);
//           }
//         }
//       }

//       return {
//         redirect: {
//           destination: '/admin',
//           permanent: false,
//         },
//       };
//     } else {



//       return {
//         redirect: {
//           destination: '/admin',
//           permanent: false
//         }
//       }
//     }
//   }
// };

export default LoginPage;
