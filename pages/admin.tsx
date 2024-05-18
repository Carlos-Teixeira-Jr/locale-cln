import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { IMessage, IMessagesByOwner } from '../common/interfaces/message/messages';
import { IOwnerData } from '../common/interfaces/owner/owner';
import { IPlan } from '../common/interfaces/plans/plans';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { IData } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import Pagination from '../components/atoms/pagination/pagination';
import { AdminPropertyCard } from '../components/molecules';
import { INotification } from '../components/molecules/cards/notificationCard/notificationCard';
import { AdminHeader, SideMenu } from '../components/organisms';
import useDeviceSize from '../hooks/deviceSize';
import { NextPageWithLayout } from './page';

interface AdminPageProps {
  ownerProperties: IOwnerProperties;
  notifications: INotification[];
  messages: IMessagesByOwner;
  ownerData: IOwnerData;
  plans: IPlan[]
}

const AdminPage: NextPageWithLayout<AdminPageProps> = ({
  ownerProperties,
  notifications,
  messages,
  ownerData,
  plans
}) => {

  const { data: session } = useSession() as any;
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const query = router.query as any;
  const [width] = useDeviceSize();
  const unreadMessages = messages?.docs?.length > 0 ? messages?.docs.filter((message) => !message.isRead) : [];
  const userName = session?.user?.data?.name;
  const plusPlan = plans.find((e) => e.name === 'Locale Plus');
  const ownerIsPlus = ownerData?.owner?.plan === plusPlan?._id ? true : false;

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
    sideMenu: `${width < 1080 ? 'hidden' : 'fixed left-0 top-7 lg:flex xl:flex md:hidden'
      } `,
  };

  return (
    <div>
      <AdminHeader isOwnerProp={isOwner} isPlus={ownerIsPlus} ownerData={ownerData} />
      <div className="flex flex-row items-center justify-evenly xl:w-fit 2xl:w-full w-full max-w-full">
        <div className={classes.sideMenu}>
          <SideMenu
            isOwnerProp={isOwner}
            notifications={notifications}
            unreadMessages={unreadMessages}
            isPlus={ownerIsPlus}
            hasProperties={ownerProperties?.docs?.length > 0}
          />
        </div>
        <div className={`flex flex-col items-center mt-24 ${width < 1080 ? 'justify-center w-full' : `${ownerProperties?.docs?.length <= 0 ? 'lg:ml-[43rem]' : 'lg:ml-[26rem]'}`}`}>

          <div className="mb-10 md:px-5 lg:px-0">
            <h1 className="font-extrabold text-xl md:text-3xl text-quaternary md:mb-5 md:mr-20. text-center">
              {userName! ? `Bem vindo ${userName ? userName : ownerData?.owner?.name}` : 'Bem vindo'}
            </h1>
            {ownerProperties?.docs && (
              <Pagination
                totalPages={ownerProperties.totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            )}
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
  const userId = session?.user.data._id || session?.user.id;
  const page = Number(context.query.page);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let ownerData;

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
      if (response?.owner?._id) {
        ownerData = response;
      } else {
        return {
          redirect: {
            destination: '/adminUserData?page=1',
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

  const [ownerProperties, notifications, messages, plans] = await Promise.all([
    fetch(`${baseUrl}/property/owner-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: ownerData?.owner?._id,
        page,
      }),
    })
      .then((res) => res.json())
      .catch(() => []),
    fetch(
      `${baseUrl}/notification/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/message/find-all-by-ownerId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: ownerData?.owner?._id,
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
    fetchJson(`${baseUrl}/property/owner-properties`),
    fetchJson(`${baseUrl}/notification/user/${userId}`),
    fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    fetchJson(`${baseUrl}/plan`),
  ]);

  if (ownerProperties?.docs?.length === 0 && notifications?.length > 0) {
    return {
      redirect: {
        destination: '/adminFavProperties?page=1',
        permanent: false,
      },
    };
  } else if (ownerProperties?.docs?.length === 0) {
    return {
      redirect: {
        destination: '/adminUserData?page=1',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ownerProperties,
      notifications,
      messages,
      ownerData,
      plans
    },
  };
}

