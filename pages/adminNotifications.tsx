import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { IPropertyInfo } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import Pagination from '../components/atoms/pagination/pagination';
import NotificationCard, {
  INotification,
} from '../components/molecules/cards/notificationCard/notificationCard';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { useIsMobile } from '../hooks/useIsMobile';
import { destroyCookie } from 'nookies';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { useState, useEffect } from 'react';

interface IMessageNotifications {
  ownerProperties: IPropertyInfo;
  notifications: [];
}

const MessageNotifications = ({
  notifications,
  ownerProperties,
}: IMessageNotifications) => {

  const isMobile = useIsMobile();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  // Determina se o usuário já possui anúncios ou não;
  useEffect(() => {
    setIsOwner(ownerProperties.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  return (
    <main>
      <AdminHeader />
      <div className="flex flex-row items-center justify-evenly">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          {!isMobile ? (
            <SideMenu isOwnerProp={isOwner} notifications={notifications} />
          ) : (
            ''
          )}
        </div>

        <div className="flex flex-col items-center mt-24 w-full lg:ml-[320px]">
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary text-center lg:my-5">
              Notificações
            </h1>
            {notifications && <Pagination totalPages={0} />}
          </div>

          <div className="lg:mb-10 flex flex-wrap flex-col md:flex-row lg:gap-10">
            {
              <div className="mx-10">
                {notifications &&
                  notifications?.map(
                    ({ description, _id, title }: INotification) => (
                      <NotificationCard
                        key={_id}
                        description={description}
                        title={title}
                        _id={_id}
                      />
                    )
                  )}
              </div>
            }

            {/* <div className="flex justify-center mb-10">
              {notifications && <Pagination totalPages={0} />}
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessageNotifications;

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
    token = session?.user?.data.access_token!!;
    refreshToken = session?.user?.data.refresh_token;
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
      const ownerIdResponse = await fetch(
        `${baseUrl}/user/find-owner-by-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: userId }),
        }
      );

      if (ownerIdResponse.ok) {
        const ownerData = await ownerIdResponse.json();
        ownerId = ownerData?.owner?._id;
      }
    } catch (error) {
      console.error(error);
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
      fetchJson(`${baseUrl}/notification/${userId}`),

      fetchJson(`${baseUrl}/property/owner-properties`),
    ]);

    const notifications = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/notification/64da04b6052b4d12939684b0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .catch(() => []);

    return {
      props: {
        ownerProperties,
        notifications,
      },
    };
  }
}
