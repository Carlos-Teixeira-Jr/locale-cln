import { useEffect, useState } from 'react';
import Pagination from '../components/atoms/pagination/pagination';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import MessagesCard from '../components/molecules/cards/messagesCard.tsx/messagesCard';
import { fetchJson } from '../common/utils/fetchJson';
import { destroyCookie } from 'nookies';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';

interface IAdminMessagesPage {
  ownerProperties: IOwnerProperties;
}

const AdminMessages = ({
  ownerProperties
}: IAdminMessagesPage) => {

  const [isMobile, setIsMobile] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  // Determina se o usuário já possui anúncios ou não;
  useEffect(() => {
    setIsOwner(ownerProperties?.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  return (
    <main>
      <AdminHeader isOwnerProp={isOwner} />

      <div className="flex flex-row items-center justify-evenly">

        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          <SideMenu
            isOwnerProp={isOwner}
            isMobileProp={false}
          />
        </div>

        <div className="flex flex-col items-center mt-24 lg:ml-[305px]">
          <div className="flex flex-col items-center">

            <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary md:mb-10 md:mr-20 text-center">
              Mensagens
            </h1>

            <Pagination totalPages={ownerProperties?.totalPages} />
          </div>

          <div className="mb-10">
            <MessagesCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMessages;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id;
  let token;
  let refreshToken;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  } else {
    token = session?.user.data.access_token!!;
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
        destroyCookie(context, 'next-auth.session-token');
        destroyCookie(context, 'next-auth.csrf-token');

        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      } else {
        try {
          const response = await fetch('http://localhost:3001/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh_token: refreshToken,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const newToken = data.access_token;
            const newRefreshToken = data.refresh_token;
            refreshToken = newRefreshToken;
            token = newToken;
            session.user.data.refresh_token = newRefreshToken;
            token = newToken;
            session.user.data.access_token = newToken;
          } else {
            console.log('Não foi possível atualizar o token.');
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;    
    let ownerId;

    try {
      const ownerIdResponse = await fetch(`${baseUrl}/user/find-owner-by-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: userId}),
      })

      if (ownerIdResponse.ok) {
        const ownerData = await ownerIdResponse.json();
        ownerId = ownerData?.owner?._id
      }
    } catch (error) {
      console.error(error)
    }

    const [ownerProperties] = await Promise.all([
      fetch(`${baseUrl}/property/owner-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId,
          page: 1,
        }),
      })
        .then((res) => res.json())
        .catch(() => []),
      fetchJson(`${baseUrl}/property/owner-properties`),
    ]);

    const notifications = await fetch(
      `http://localhost:3001/notification/64da04b6052b4d12939684b0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const dataNot = await notifications.json();

    return {
      props: {
        ownerProperties,
        dataNot,
      },
    };
  }
}
