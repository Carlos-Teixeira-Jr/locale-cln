import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { IMessagesByOwner } from '../common/interfaces/message/messages';
import { IOwnerData } from '../common/interfaces/owner/owner';
import { IPlan } from '../common/interfaces/plans/plans';
import { IFavProperties } from '../common/interfaces/properties/favouriteProperties';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { IPropertyInfo } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import SentimentIcon from '../components/atoms/icons/sentimentIcon';
import Pagination from '../components/atoms/pagination/pagination';
import NotificationCard, {
  INotification,
} from '../components/molecules/cards/notificationCard/notificationCard';
import { AdminHeader, SideMenu } from '../components/organisms';
import { useIsMobile } from '../hooks/useIsMobile';

interface IMessageNotifications {
  properties?: IPropertyInfo;
  notifications: INotification[];
  ownerProperties?: IOwnerProperties;
  messages: IMessagesByOwner;
  plans: IPlan[];
  ownerData: IOwnerData;
  favouriteProperties: IFavProperties
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const MessageNotifications = ({
  ownerProperties,
  notifications,
  messages,
  plans,
  ownerData,
  favouriteProperties
}: IMessageNotifications) => {

  const isMobile = useIsMobile();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [showPagination, setShowPagination] = useState<boolean>(notifications.length > 0 ? true : false);
  const userNotifications = notifications;
  const adminNots = notifications as [];
  const unreadMessages = messages?.docs?.length > 0 ? messages?.docs?.filter((message) => !message.isRead) : [];
  const plusPlan = plans.find((e) => e.name === 'Locale Plus');
  const ownerIsPlus = ownerData?.owner?.plan === plusPlan?._id ? true : false;

  useEffect(() => {
    // Função a ser executada quando o componente for desmontado
    const updateNotification = async () => {
      try {
        const response = await fetch(`${baseUrl}/notification/update-notifications`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(notifications),
          })

        if (response.ok) {
          console.log('Notificações visualizadas')
        } else {
          console.error('Houve um erro ao atualizar as notificações visualizadas.')
        }
      } catch (error) {
        console.error(error)
      }
    }

    return () => {
      updateNotification();
    };
  }, []);

  useEffect(() => {
    setIsOwner(ownerProperties?.docs && ownerProperties?.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  useEffect(() => {
    if (userNotifications?.length === 0) {
      setShowPagination(!showPagination);
    }
  }, [userNotifications]);

  return (
    <main>
      <AdminHeader isOwnerProp={isOwner} isPlus={ownerIsPlus} ownerData={ownerData} />
      <div className={classes.body}>
        <div className={classes.sideMenu}>
          {!isMobile ? (
            <SideMenu
              isOwnerProp={isOwner}
              notifications={adminNots && adminNots}
              unreadMessages={unreadMessages}
              isPlus={ownerIsPlus}
              hasProperties={ownerProperties?.docs && ownerProperties?.docs?.length > 0 ? true : false}
              favouriteProperties={favouriteProperties}
              messages={messages.docs}
            />
          ) : (
            ''
          )}
        </div>
        <div className={classes.content}>
          <h1 className={classes.title}>Notificações</h1>

          {showPagination ? (
            ''
          ) : (
            <div className=" md:mr-16">
              <Pagination totalPages={0} />
            </div>
          )}

          {notifications?.length == 0 && (
            <div className={classes.notFound}>
              <SentimentIcon />
              <h1 className="text-2xl text-quaternary mt-2">
                Não tem nenhuma notificação.
              </h1>
            </div>
          )}

          {notifications?.length > 0 &&
            notifications?.map(
              ({
                description,
                _id,
                title,
                isRead,
                notifications,
                setShowPagination,
                setNotifications,
                showPagination,
              }: INotification) => (
                <div key={_id} className="flex flex-col items-center">
                  <NotificationCard
                    key={_id}
                    description={description}
                    title={title}
                    _id={_id}
                    isRead={isRead}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    showPagination={showPagination}
                    setShowPagination={setShowPagination}
                  />
                </div>
              )
            )}
        </div>

        {showPagination ? (
          ''
        ) : (
          <div className=" md:mr-16">
            <Pagination totalPages={0} />
          </div>
        )}
      </div>
    </main>
  );
};

export default MessageNotifications;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = Number(context.query.page);
  let ownerId;
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
      ownerData = response;
      ownerId = ownerData?.owner?._id;
    } else {
      console.error('erro - find-owner-by-user:', ownerIdResponse);
    }
  } catch (error) {
    console.error(error);
  }

  const [ownerProperties, notifications, messages, plans, favouriteProperties] = await Promise.all([
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
    fetchJson(`${baseUrl}/plan`),
    fetchJson(`${baseUrl}/property/owner-properties`),
    fetchJson(`${baseUrl}/notification/user/${userId}`),
    fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    fetchJson(`${baseUrl}/user/favourite`),
  ]);

  return {
    props: {
      notifications,
      ownerProperties,
      messages,
      plans,
      ownerData,
      favouriteProperties
    },
  };
}

const classes = {
  sideMenu: 'fixed sm:hidden hidden md:hidden lg:flex xl:flex left-0 top-7',
  body: 'flex flex-row items-center justify-center lg:ml-72 xl:ml-72',
  content: 'flex flex-col mt-16 xl:mx-auto max-w-[1232px] justify-center md:mx-auto',
  title:
    'font-extrabold text-lg md:text-2xl text-quaternary my-10 text-center md:mx-auto',
  notFound:
    'flex flex-col items-center align-middle lg:mt-36 justify-center mr-0 lg:mx-auto',
};
