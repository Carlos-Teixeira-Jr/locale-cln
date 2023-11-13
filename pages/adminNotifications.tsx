import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { IPropertyInfo } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import Pagination from '../components/atoms/pagination/pagination';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { useIsMobile } from '../hooks/useIsMobile';

interface IMessageNotifications {
  properties: IPropertyInfo;
  notifications: any;
}

const MessageNotifications = ({
  notifications,
  properties,
}: IMessageNotifications) => {
  const isMobile = useIsMobile();
  const isOwner = properties?.docs?.length > 0 ? true : false;

  return (
    <main>
      <AdminHeader />
      <div className="flex flex-row items-center justify-evenly">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          {!isMobile ? (
            <SideMenu isOwnerProp={isOwner} notifications={notifications} />
          ) : (
            ''
          )}
          <div className="flex flex-col w-full max-w-[1232px] xl:mx-auto">
            <h1 className="text-2xl md:text-5xl text-quaternary font-bold mt-28 ml-8">
              Notificações
            </h1>
            <div className="flex justify-center">
              {notifications && <Pagination totalPages={0} />}
            </div>

            {/* <div className="mx-10">
              {notifications.map(({ description, _id, title }: INotification) => (
                <NotificationCard
                  key={_id}
                  description={description}
                  title={title}
                  _id={_id}
                />
              ))}
            </div> */}

            <div className="flex justify-center mb-10">
              {notifications && <Pagination totalPages={0} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessageNotifications;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const [notifications, properties] = await Promise.all([
    fetch(`${baseUrl}/notification/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/property/owner-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: userId,
        page: 1,
      }),
    })
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/notification/${userId}`),
    fetchJson(`${baseUrl}/property/owner-properties`),
  ]);

  return {
    props: {
      notifications,
      properties,
    },
  };
}
