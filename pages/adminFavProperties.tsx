import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IFavProperties } from '../common/interfaces/properties/favouriteProperties';
import {
  IData,
  IPropertyInfo,
} from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import SentimentIcon from '../components/atoms/icons/sentimentIcon';
import Pagination from '../components/atoms/pagination/pagination';
import { PropertyCard } from '../components/molecules';
import { AdminHeader, SideMenu } from '../components/organisms';
import { useIsMobile } from '../hooks/useIsMobile';
import { NextPageWithLayout } from './page';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsOwner(properties?.docs?.length > 0 ? true : false);
  }, [properties]);

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
    <div className='my-5'>
      <AdminHeader isOwnerProp={isOwner} />
      <div className={classes.content}>
        <div className={classes.sideMenu}>
          {!isMobile ? (
            <SideMenu isOwnerProp={isOwner} notifications={notifications} />
          ) : (
            ''
          )}
        </div>
        <div className={classes.favPropertiesContainer}>
          <h1 className={classes.title}>Imóveis Favoritos</h1>
          {favouriteProperties?.docs?.length === 0 ? (
            ''
          ) : (
            <div className=" md:mr-16">
              <Pagination totalPages={favouriteProperties?.totalPages} />
            </div>
          )}
          {favouriteProperties?.docs?.length == 0 && (
            <div className={classes.notFound}>
              <SentimentIcon />
              <h1 className={classes.h1}>
                Você ainda não favoritou nenhum imóvel.
              </h1>
            </div>
          )}
          <div className={classes.favProperties}>
            {favouriteProperties?.docs?.length > 0 &&
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
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFavProperties;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const userId = session?.user.data._id || session?.user.id;
  const page = Number(context.query.page);
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
      ownerId = ownerData?.owner?._id;
    }
  } catch (error) {
    console.error(error);
  }

  const [notifications, favouriteProperties, ownerProperties] =
    await Promise.all([
      fetch(`${baseUrl}/notification/user/${userId}`, {
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
      fetchJson(`${baseUrl}/notification/user/${userId}`),
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

const classes = {
  content: 'flex flex-col mt-16 xl:ml-80 max-w-[1232px] justify-center md:mx-5',
  sideMenu: 'fixed left-0 top-7 sm:hidden hidden md:hidden lg:flex',
  title:
    'font-extrabold text-lg md:text-2xl text-quaternary md:my-5 text-center md:mx-auto',
  h1: 'text-2xl text-quaternary mt-2',
  favPropertiesContainer:
    'flex flex-col items-center justify-center mb-5 max-w-[1215px]',
  notFound:
    'flex flex-col items-center text-center align-middle lg:mt-36 justify-center mr-0 lg:mx-auto',
  favProperties:
    'grid sm:grid-cols-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 my-5 gap-10 lg:justify-start',
};
