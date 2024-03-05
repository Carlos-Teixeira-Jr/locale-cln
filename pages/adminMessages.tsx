import jwt, { JwtPayload } from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { useEffect, useState } from 'react';
import { IMessage } from '../common/interfaces/message/messages';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { IData } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import SentimentIcon from '../components/atoms/icons/sentimentIcon';
import Pagination from '../components/atoms/pagination/pagination';
import { MessagesCard } from '../components/molecules';
import { AdminHeader, SideMenu } from '../components/organisms';
import { useIsMobile } from '../hooks/useIsMobile';

interface IMessages {
  docs: IMessage[];
  properties: IData[];
  totalPages: number;
  page: number;
}

interface IAdminMessagesPage {
  ownerProperties: IOwnerProperties;
  messages: IMessages;
  notifications: [];
}

const AdminMessages = ({
  ownerProperties,
  messages,
  notifications,
}: IAdminMessagesPage) => {

  const router = useRouter();
  const query = router.query as any;
  const [isOwner, setIsOwner] = useState<boolean>(ownerProperties?.docs?.length > 0 ? true : false);
  const properties = messages?.properties;
  const messagesCount = messages?.docs?.length;
  const totalPages = messages?.totalPages;
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (router.query.page !== undefined && typeof query.page === 'string') {
      const parsedPage = parseInt(query.page);
      setCurrentPage(parsedPage);
    }
  }, [router.query.page, query.pag]);

  useEffect(() => {
    const pageQueryParam =
      router.query.page !== undefined && typeof query.page === 'string'
        ? parseInt(query.page)
        : 1;

    if (pageQueryParam !== currentPage) {
      const queryParams = {
        ...query,
        page: currentPage,
      };
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [currentPage]);

  return (
    <main>
      <AdminHeader isOwnerProp={isOwner} />
      <div className={classes.body}>
        <div className={classes.sideMenu}>
          {!isMobile ? (
            <SideMenu isOwnerProp={isOwner} notifications={notifications} />
          ) : (
            ''
          )}
        </div>
        <div className={classes.content}>
          <h1 className={classes.title}>Mensagens</h1>
          {!messagesCount ? (
            ''
          ) : (
            <Pagination
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          )}
          {!messagesCount && (
            <div className={classes.notFound}>
              <SentimentIcon />
              <h1 className="text-2xl text-quaternary mt-2">
                Não tem nenhuma mensagem.
              </h1>
            </div>
          )}
          {messagesCount > 0 &&
            properties.map(({ _id, images, address }: IData) => (
              <div key={_id} className={classes.cardContainer}>
                <MessagesCard
                  key={_id}
                  image={images[0]}
                  address={address}
                  messages={messages?.docs.filter(
                    (message) => message.propertyId === _id
                  )}
                  propertyId={_id}
                />
              </div>
            ))
          }
          <div className="flex justify-center mb-10">
            {messagesCount ? (
              <Pagination
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMessages;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId =
    session?.user.data._id !== undefined
      ? session?.user.data._id
      : session?.user.id;
  let token;
  let refreshToken;
  const page = Number(context.query.page);

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
    const isTokenExpired = decodedToken?.exp
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
          body: JSON.stringify({ _id: userId  }),
        }
      );

      if (ownerIdResponse.ok) {
        const ownerData = await ownerIdResponse.json();
        ownerId = ownerData?.owner?._id;
      }
    } catch (error) {
      console.error(error);
    }

    const [notifications, ownerProperties, messages] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/notification/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .catch(() => []),
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
      fetch(`${baseUrl}/message/find-all-by-ownerId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId,
          page,
        }),
      })
        .then((res) => res.json())
        .catch(() => []),
      fetchJson(`${baseUrl}/notification/${userId}`),

      fetchJson(`${baseUrl}/property/owner-properties`),
      fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    ]);

    return {
      props: {
        ownerProperties,
        messages,
        notifications,
      },
    };
  }
}

const classes = {
  body: 'flex flex-row items-center justify-center lg:ml-72 xl:ml-72',
  sideMenu: 'fixed sm:hidden hidden md:hidden lg:flex xl:flex left-0 top-7',
  content: 'flex flex-col items-center justify-center mb-5 max-w-[1215px]',
  title:
    'font-extrabold text-lg md:text-2xl text-quaternary md:mb-5 text-center md:mr-16',
  notFound:
    'flex flex-col items-center align-middle mt-36 justify-center mr-0 lg:mr-20',
  cardContainer:
    'grid sm:grid-cols-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 my-5 gap-10 lg:justify-start',
};
