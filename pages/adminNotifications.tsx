import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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
  ownerProperties?: IOwnerProperties | any;
}

const MessageNotifications = ({
  ownerProperties,
  notifications,
}: IMessageNotifications) => {

  const isMobile = useIsMobile();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [showPagination, setShowPagination] = useState<boolean>(true);
  const [userNotifications, setUserNotifications] = useState<INotification[]>(notifications);
  const adminNots = notifications as [];

  useEffect(() => {
    setIsOwner(ownerProperties?.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  useEffect(() => {
    if (userNotifications?.length === 0) {
      setShowPagination(!showPagination);
    }
  }, [userNotifications]);

  return (
    <main>
      <AdminHeader />
      <div className={classes.body}>
        <div className={classes.sideMenu}>
          {!isMobile ? (
            <SideMenu
              isOwnerProp={isOwner}
              notifications={adminNots && adminNots}
            />
          ) : (
            ''
          )}
        </div>
        <div className={classes.content}>
          <h1 className={classes.title}>Notificações</h1>

          {!showPagination ? (
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

        {!showPagination ? (
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
    } else {
      console.error('erro - find-owner-by-user:', ownerIdResponse);
    }
  } catch (error) {
    console.error(error);
  }

  const [ownerProperties, notifications] = await Promise.all([
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
    fetchJson(`${baseUrl}/property/owner-properties`),
    fetchJson(`${baseUrl}/notification/user/${userId}`)
  ]);

  return {
    props: {
      notifications,
      ownerProperties
    },
  };
}

const classes = {
  sideMenu: 'fixed sm:hidden hidden md:hidden lg:flex xl:flex left-0 top-7',
  body: 'flex flex-row items-center justify-center lg:ml-72 xl:ml-72',
  content: 'flex flex-col items-center justify-center mb-5 max-w-[1215px]',
  title:
    'font-extrabold text-lg md:text-2xl text-quaternary md:mb-5 text-center md:mr-16',
  notFound:
    'flex flex-col items-center align-middle mt-36 justify-center mr-0 lg:mr-20',
};
