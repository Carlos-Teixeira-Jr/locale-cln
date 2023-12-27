import jwt, { JwtPayload } from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { destroyCookie } from 'nookies';
import { useEffect, useState } from 'react';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { IPropertyInfo } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import SentimentIcon from '../components/atoms/icons/sentimentIcon';
import Pagination from '../components/atoms/pagination/pagination';
import NotificationCard, {
  INotification,
} from '../components/molecules/cards/notificationCard/notificationCard';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { useIsMobile } from '../hooks/useIsMobile';

interface IMessageNotifications {
  properties: IPropertyInfo;
  notifications: [];
  ownerProperties?: IOwnerProperties;
}

const MessageNotifications = ({
  ownerProperties,
  notifications,
}: IMessageNotifications) => {
  const isMobile = useIsMobile();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    setIsOwner(ownerProperties?.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  return (
    <main>
      <AdminHeader />
      <div className="flex flex-row items-center justify-center lg:ml-72 xl:ml-72">
        <div className="fixed sm:hidden hidden md:hidden lg:flex xl:flex left-0 top-20">
          {!isMobile ? (
            <SideMenu isOwnerProp={isOwner} notifications={notifications} />
          ) : (
            ''
          )}
        </div>
        <div className="flex flex-col max-w-[1232px] items-center mt-28">
          <h1 className="flex text-4xl md:text-5xl text-quaternary font-bold justify-center">
            Notificações
          </h1>
          <div className="flex flex-col items-center justify-center ">
            <div className="flex justify-center mt-8">
              {notifications.length !== 0 && <Pagination totalPages={0} />}
            </div>

            {
              <div className="mx-10 mb-5 mt-[-1rem] ">
                {notifications.length == 0 ? (
                  <div className="flex flex-col items-center align-middle mt-36">
                    <SentimentIcon />
                    <h1 className="text-4xl text-quaternary">
                      Não tem nenhuma notificação.
                    </h1>
                  </div>
                ) : (
                  notifications?.map(
                    ({ description, _id, title, isRead }: INotification) => (
                      <NotificationCard
                        key={_id}
                        description={description}
                        title={title}
                        _id={_id}
                        isRead={isRead}
                      />
                    )
                  )
                )}
              </div>
            }
          </div>

          <div className="flex justify-center mb-10">
            {notifications.length !== 0 && <Pagination totalPages={0} />}
          </div>
        </div>
      </div>
    </main>
  );
};
export default MessageNotifications;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId =
    session?.user.data._id !== undefined
      ? session?.user.data._id
      : session?.user.id;
  let token;
  let refreshToken;
  const { query } = context;
  const page = query.page;

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
    const id = userId.toString();

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
      } else {
        console.log('erro', ownerIdResponse);
      }
    } catch (error) {
      console.error(error);
    }

    if (ownerId) {
      const [ownerProperties] = await Promise.all([
        fetch(`${baseUrl}/property/owner-properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId,
            page: Number(page),
          }),
        })
          .then((res) => res.json())
          .catch(() => []),
        fetchJson(`${baseUrl}/property/owner-properties`),
      ]);

      const notifications = await fetch(`${baseUrl}/notification/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .catch(() => []);
      console.log('adminNotifications:', userId);
      return {
        props: {
          notifications,
          ownerProperties,
        },
      };
    }
  }
}
