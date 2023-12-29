import jwt, { JwtPayload } from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { destroyCookie } from 'nookies';
import { useEffect, useState } from 'react';
import { IFavProperties } from '../common/interfaces/properties/favouriteProperties';
import {
  IData,
  IPropertyInfo,
} from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import SentimentIcon from '../components/atoms/icons/sentimentIcon';
import Pagination from '../components/atoms/pagination/pagination';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';
import { useRouter } from 'next/router';

interface IAdminFavProperties {
  favouriteProperties: IFavProperties;
  ownerProperties: IPropertyInfo;
  notifications: [];
}

const AdminFavProperties: NextPageWithLayout<IAdminFavProperties> = ({
  favouriteProperties,
  ownerProperties,
  notifications,
}) => {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [properties, _setProperties] = useState<IPropertyInfo>(ownerProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const query = router.query as any;

  // Determina se o usuário já possui anúncios ou não;
  useEffect(() => {
    setIsOwner(properties?.docs?.length > 0 ? true : false);
  }, [properties]);

  // Determina se o usuário já possui anúncios ou não;
  useEffect(() => {
    setIsOwner(ownerProperties.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

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

  return (
    <>
      <AdminHeader isOwnerProp={isOwner} />
      <div className="flex flex-row items-center justify-evenly">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          <SideMenu isOwnerProp={isOwner} notifications={notifications} />
        </div>
        <div className="flex flex-col items-center mt-24 w-full lg:pl-72">
          <div className="flex flex-col items-center mb-5 max-w-[1215px]">
            <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary md:mb-5 text-center">
              Imóveis Favoritos
            </h1>
            {favouriteProperties?.docs?.length === 0 ? (
              ''
            ) : (
              <Pagination 
                totalPages={favouriteProperties?.totalPages} 
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            )}

            <div className="flex flex-col md:flex-row flex-wrap md:gap-2 lg:gap-10 my-5 lg:justify-start md:px-2 lg:px-10">
              {favouriteProperties?.docs?.length > 0 ? (
                favouriteProperties?.docs.map(
                  ({
                    _id,
                    prices,
                    address,
                    images,
                    highlighted,
                    description,
                  }: IData) => (
                    <div className="w-60" key={_id}>
                      <PropertyCard
                        key={_id}
                        description={description}
                        images={images}
                        location={`${address.city}, ${address.uf} - ${address.streetName}`}
                        favorited={highlighted}
                        id={_id}
                        prices={prices}
                        highlighted={highlighted}
                      />
                    </div>
                  )
                )
              ) : (
                <div className="flex flex-col items-center align-middle mt-36">
                  <SentimentIcon />
                  <h1 className="text-3xl text-quaternary">
                    Você ainda não favotirou nenhum imóvel.
                  </h1>
                </div>
              )}
            </div>
            {/* <Pagination 
              totalPages={0} 
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFavProperties;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id;
  let token;
  let refreshToken;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let ownerId;
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
    token = session?.user.data.access_token!!;
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
        console.log(ownerId);
      }
    } catch (error) {
      console.error(error);
    }

    const [notifications, favouriteProperties, ownerProperties] =
      await Promise.all([
        fetch(`${baseUrl}/notification/64da04b6052b4d12939684b0`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .catch(() => []),
        fetch(`${baseUrl}/user/favourite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId,
            page: Number(page),
          }),
        })
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
        fetchJson(`${baseUrl}/notification/${userId}`),
        fetchJson(`${baseUrl}/user/favourite`),
        fetchJson(`${baseUrl}/property/owner-properties`),
      ]);

    return {
      props: {
        favouriteProperties,
        ownerProperties,
        notifications,
      },
    };
  }
}
