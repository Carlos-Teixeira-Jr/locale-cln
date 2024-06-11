import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IMessagesByOwner } from '../common/interfaces/message/messages';
import { IOwnerData } from '../common/interfaces/owner/owner';
import { IPlan } from '../common/interfaces/plans/plans';
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
  messages: IMessagesByOwner;
  plans: IPlan[];
  ownerData: IOwnerData
}

const AdminFavProperties: NextPageWithLayout<IAdminFavProperties> = ({
  favouriteProperties,
  ownerProperties,
  notifications,
  messages,
  plans,
  ownerData
}) => {

  const [properties, _setProperties] = useState<IPropertyInfo>(ownerProperties);
  const isOwner = properties?.docs?.length > 0 ? true : false;

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const query = router.query as any;
  const isMobile = useIsMobile();
  const unreadMessages = messages?.docs?.length > 0 ? messages?.docs.filter((message) => !message.isRead) : [];
  const plusPlan = plans.find((e) => e.name === 'Locale Plus');
  const ownerIsPlus = ownerData?.owner?.plan === plusPlan?._id ? true : false;


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
      <AdminHeader isOwnerProp={isOwner} isPlus={ownerIsPlus} ownerData={ownerData} />
      <div className={classes.content}>
        <div className={classes.sideMenu}>
          {!isMobile ? (
            <SideMenu
              isOwnerProp={isOwner}
              notifications={notifications}
              unreadMessages={unreadMessages}
              isPlus={ownerIsPlus}
              hasProperties={ownerProperties?.docs?.length > 0}
            />
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
          {favouriteProperties?.docs?.length === 0 && (
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
                  metadata,
                  adType,
                  propertyType
                }: IData) => (
                  <div className="w-full md:w-60" key={_id}>
                    <PropertyCard
                      key={_id}
                      description={description}
                      images={images}
                      location={address.streetName}
                      favorited={highlighted}
                      id={_id}
                      prices={prices}
                      highlighted={highlighted}
                      bedrooms={metadata.find((e) => e.type === 'bedroom')?.amount}
                      bathrooms={metadata.find((e) => e.type === 'bathroom')?.amount}
                      parking_spaces={metadata.find((e) => e.type === 'garage')?.amount}
                      adType={adType}
                      propertyType={propertyType}
                      address={address}
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
  let ownerData;
  const userId = session?.user.data._id || session?.user.id;
  const page = Number(context.query.page);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let ownerId;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }


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
      const response = await ownerIdResponse.json();
      ownerData = response;
      ownerId = ownerData?.owner?._id;
    }
  } catch (error) {
    console.error(error);
  }

  const [
    notifications,
    favouriteProperties,
    ownerProperties,
    messages,
    plans
  ] = await Promise.all([
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
    fetch(`${baseUrl}/plan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/notification/user/${userId}`),
    fetchJson(`${baseUrl}/user/favourite`),
    fetchJson(`${baseUrl}/property/owner-properties`),
    fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    fetchJson(`${baseUrl}/plan`),
  ]);

  return {
    props: {
      favouriteProperties,
      ownerProperties,
      notifications,
      messages,
      plans,
      ownerData
    },
  };
}

const classes = {
  content: 'flex flex-col mt-16 xl:ml-80 xl:max-w-[1232px] 2xl:w-full 2xl:mx-auto justify-center md:mx-5',
  sideMenu: 'fixed left-0 top-7 sm:hidden hidden md:hidden lg:flex',
  title:
    'font-extrabold text-lg md:text-2xl text-quaternary md:my-5 text-center md:mx-auto',
  h1: 'md:text-2xl text-quaternary mt-2',
  favPropertiesContainer:
    'flex flex-col items-center justify-center my-5 max-w-[1215px]',
  notFound:
    'flex flex-col items-center text-center align-middle lg:mt-36 justify-center mr-0 lg:mx-auto',
  favProperties:
    'grid sm:grid-cols-1 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 my-5 gap-10 lg:justify-start',
};
