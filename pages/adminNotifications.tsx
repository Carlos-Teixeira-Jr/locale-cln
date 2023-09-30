import { useEffect, useState } from 'react';
import Pagination from '../components/atoms/pagination/pagination';
import NotificationCard, {
  INotification,
} from '../components/molecules/cards/notificationCard/notificationCard';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';

const MessageNotifications = ({ dataNot }: any) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1000);
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main>
      <AdminHeader />

      <div className="lg:flex">
        {!isMobile ? (
          <SideMenu
            isMobileProp={false}
            isOwnerProp={false}
            notifications={dataNot}
          />
        ) : (
          ''
        )}
        <div className="flex flex-col w-full max-w-[1232px] xl:mx-auto">
          <h1 className="text-2xl md:text-5xl text-quaternary font-bold mt-28 ml-8">
            Notificações
          </h1>
          <div className="flex justify-center">
            <Pagination
              totalPages={0}
              page={0}
              onPageChange={function (newPageIndex: number): void {
                throw new Error('Function not implemented.');
              }}
            />
          </div>

          <div className="mx-10">
            {dataNot.map(({ description, _id, title }: INotification) => (
              <NotificationCard
                key={_id}
                description={description}
                title={title}
                _id={_id}
              />
            ))}
          </div>

          <div className="flex justify-center mb-10">
            <Pagination
              totalPages={0}
              page={0}
              onPageChange={function (newPageIndex: number): void {
                throw new Error('Function not implemented.');
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessageNotifications;

export async function getStaticProps() {
  const notifications = await fetch(
    `http://localhost:3001/notification/64da04b6052b4d12939684b0`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const dataNot = await notifications.json();

  return {
    props: {
      dataNot,
    },
  };
}
