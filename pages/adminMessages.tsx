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
import Pagination from '../components/atoms/pagination/pagination';
import MessagesCard from '../components/molecules/cards/messagesCard.tsx/messagesCard';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';

interface IMessages {
  docs: IMessage[];
  properties: IData[];
  totalPages: number;
  page: number;
}

interface IAdminMessagesPage {
  ownerProperties: IOwnerProperties;
  messages: IMessages;
  dataNot: [];
}

const AdminMessages = ({
  ownerProperties,
  messages,
  dataNot,
}: IAdminMessagesPage) => {
  const router = useRouter();
  const query = router.query as any;
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const properties = messages?.properties;
  const messagesCount = messages?.docs?.length;
  const totalPages = messages?.totalPages;
  const [currentPage, setCurrentPage] = useState(1);

  //// PAGE ////

  useEffect(() => {
    if (router.query.page !== undefined && typeof query.page === 'string') {
      const parsedPage = parseInt(query.page);
      setCurrentPage(parsedPage);
    }
  });

  useEffect(() => {
    // Check if the page parameter in the URL matches the current page
    const pageQueryParam =
      router.query.page !== undefined && typeof query.page === 'string'
        ? parseInt(query.page)
        : 1;

    // Only update the URL if the page parameter is different from the current page
    if (pageQueryParam !== currentPage) {
      const queryParams = {
        ...query,
        page: currentPage,
      };
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [currentPage]);

  // Determina se o usuário já possui anúncios ou não;
  useEffect(() => {
    setIsOwner(ownerProperties?.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  return (
    <main>
      <AdminHeader isOwnerProp={isOwner} />

      <div className="flex flex-row items-center justify-evenly">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          <SideMenu isOwnerProp={isOwner} notifications={dataNot} />
        </div>

        <div className="flex flex-col items-center mt-24 w-full lg:ml-[320px]">
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary md:mb-5 text-center">
              Mensagens
            </h1>

            <Pagination
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>

          <div className="lg:mb-10 flex flex-wrap flex-col md:flex-row lg:gap-10">
            {messagesCount > 0 &&
              properties.map(({ _id, images, address }: IData) => (
                <MessagesCard
                  image={images[0]}
                  address={address}
                  messages={messages?.docs.filter(
                    (message) => message.propertyId === _id
                  )}
                  propertyId={_id}
                />
              ))}
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

    const [ownerProperties, messages] = await Promise.all([
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
      fetchJson(`${baseUrl}/property/owner-properties`),
      fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
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

    const dataNot = notifications;

    return {
      props: {
        ownerProperties,
        messages,
        dataNot,
      },
    };
  }
}
