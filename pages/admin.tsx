import jwt, { JwtPayload } from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { IMessage } from '../common/interfaces/message/messages';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { IData } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import Pagination from '../components/atoms/pagination/pagination';
import { AdminPropertyCard } from '../components/molecules';
import { AdminHeader, SideMenu } from '../components/organisms';
import useDeviceSize from '../hooks/deviceSize';
import { NextPageWithLayout } from './page';

interface AdminPageProps {
  ownerProperties: IOwnerProperties;
  notifications: [];
}

const AdminPage: NextPageWithLayout<AdminPageProps> = ({
  ownerProperties,
  notifications,
}) => {
  console.log("🚀 ~ ownerProperties:", ownerProperties)

  const { data: session } = useSession() as any;
  const [isOwner, setIsOwner] = useState<boolean>(false);
  console.log("🚀 ~ isOwner:", isOwner)
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const query = router.query as any;
  const [width, height] = useDeviceSize();

  useEffect(() => {
    setIsOwner(ownerProperties?.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  useEffect(() => {
    if (router.query.page !== undefined && typeof query.page === 'string') {
      const parsedPage = parseInt(query.page);
      setCurrentPage(parsedPage);
    }
  });

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

  const classes = {
    sideMenu: `${width < 1080 ? 'hidden' : 'flex'
      } fixed left-0 top-7 md:hidden lg:flex xl:flex`,
  };

  return (
    <div>
      <AdminHeader isOwnerProp={isOwner} />
      <div className="flex flex-row items-center justify-evenly">
        <div className={classes.sideMenu}>
          <SideMenu isOwnerProp={isOwner} notifications={notifications} />
        </div>
        <div className="flex flex-col items-center mt-24 lg:ml-[305px]">
          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-xl md:text-3xl text-quaternary md:mb-5 md:mr-20. text-center">
              Bem vindo
              {session?.username !== undefined ? session?.username : ''}!
            </h1>
            {isOwner && ownerProperties?.docs && (
              <Pagination
                totalPages={ownerProperties.totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            )}
          </div>

          <div className="mb-10 md:px-5 lg:px-0">
            {isOwner &&
              ownerProperties?.docs?.map(
                ({
                  _id,
                  prices,
                  address,
                  images,
                  isActive,
                  highlighted,
                  views,
                }: IData) => (
                  <AdminPropertyCard
                    key={_id}
                    _id={_id}
                    image={images[0]}
                    price={prices.length > 0 ? prices[0]?.value : 0}
                    location={address.streetName}
                    views={views}
                    messages={ownerProperties?.messages?.filter(
                      (item: IMessage) => item.propertyId === _id
                    )}
                    isActiveProp={isActive}
                    highlighted={highlighted}
                  />
                )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

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
  let ownerProperties;

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
          body: JSON.stringify({ userId }),
        }
      );

      if (ownerIdResponse.ok) {
        const ownerData = await ownerIdResponse.json();
        if (ownerData?.owner?._id) {
          ownerId = ownerData?.owner?._id;
        } else {
          return {
            redirect: {
              destination: '/adminFavProperties?page=1',
              permanent: false,
            },
          };
        }
      } else {
        console.log('erro - find-owner-by-user:', ownerIdResponse);
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
          page,
        }),
      })
        .then((res) => res.json())
        .catch(() => []),
      fetchJson(`${baseUrl}/property/owner-properties`),
    ]);

    const notifications = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/notification/user/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .catch(() => []);


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
      console.log("🚀 ~ getServerSideProps ~ ownerProperties:", ownerProperties)

      return {
        props: {
          ownerProperties,
          notifications,
        },
      };
    }

    return {
      props: {
        notifications,
      },
    };
  }
}
