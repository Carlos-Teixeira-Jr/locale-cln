import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { IPropertyInfo } from '../common/interfaces/property/propertyData';
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
}

const MessageNotifications = ({ notifications }: IMessageNotifications) => {
  const isMobile = useIsMobile();
  //const isOwner = properties?.docs?.length > 0 ? true : false;

  useEffect(() => {
    console.log('notificações:', notifications);
  });

  return (
    <main>
      <AdminHeader />
      <div className="flex flex-row items-center justify-center lg:ml-72 xl:ml-72">
        <div className="fixed sm:hidden hidden md:hidden lg:flex xl:flex left-0 top-20">
          {!isMobile ? (
            <SideMenu isOwnerProp={true} notifications={notifications} />
          ) : (
            ''
          )}
        </div>
        <div className="flex flex-col max-w-[1232px] items-center mt-28">
          <h1 className="flex text-4xl md:text-5xl text-quaternary font-bold justify-center">
            Notificações
          </h1>
          <div className="flex flex-col items-center justify-center max-w-[1232px]">
            <div className="flex justify-center mt-8">
              {notifications.length !== 0 && <Pagination totalPages={0} />}
            </div>

            {
              <div className="mx-10 mb-5 mt-[-1rem]">
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
    session?.user.data.id !== undefined
      ? session?.user.data.id
      : session?.user.id;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  console.log(session);
  const id = userId.toString();
  const userIdentification = String(userId);
  const iDD = '' + userId;
  const idUser = `${userId}`;

  console.log(id);
  console.log(userIdentification);
  console.log(iDD);
  console.log(idUser);

  const notifications = await fetch(`${baseUrl}/notification/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .catch(() => []);
  console.log(notifications);
  return {
    props: {
      notifications,
    },
  };
}
