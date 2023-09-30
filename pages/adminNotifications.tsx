import Image from 'next/image';
import { useEffect, useState } from 'react';
import Pagination from '../components/atoms/pagination/pagination';
import NotificationCard from '../components/molecules/cards/notificationCard/notificationCard';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';

const MessageNotifications: NextPageWithLayout = ({
  propertyMessages,
}: any) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main>
      <AdminHeader image={''} />

      <div className="lg:flex">
        <SideMenu isMobile={isMobile} />

        <div className="flex flex-col w-full max-w-[1536px] xl:mx-auto">
          <h1 className="lg:m-10 m-5 mx-auto text-5xl font-bold leading-[56px] text-quaternary">
            Mensagens
          </h1>

          <div className="lg:flex lg:mx-10 mx-auto mb-10">
            <div>
              <Image
                src={'/images/foto-message-card.png'}
                alt={''}
                width={260}
                height={160}
              />
            </div>
            <div className="mx-5 my-auto">
              <h2 className="lg:text-3xl my-5 text-quaternary font-bold leading-6">
                Rua Eliú Araujo, 45
              </h2>
              <p className="text-2xl text-quaternary">Cassino</p>
              <p className="text-2xl text-quaternary">Rio Grande - RS</p>
            </div>
          </div>

          <div className="flex justify-center mb-5">
            <Pagination totalPages={0} page={0} onPageChange={function (newPageIndex: number): void {
              throw new Error('Function not implemented.');
            } } />
          </div>

          <div className="mx-10">
            {propertyMessages.map(({ email, message, phone, name }: any) => (
              <NotificationCard
                key={name}
                name={name}
                email={email}
                phone={phone}
                message={message}
              />
            ))}
          </div>

          <div className="flex justify-center mb-10">
            <Pagination totalPages={0} page={0} onPageChange={function (newPageIndex: number): void {
              throw new Error('Function not implemented.');
            } } />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessageNotifications;

export async function getStaticProps() {
  const propertyMessages = await fetch(
    'https://raw.githubusercontent.com/Carlos-Teixeira-Jr/data/main/data/messages.json'
  )
    .then((res) => res.json())
    .catch(() => ({}));

  return {
    props: {
      propertyMessages,
    },
  };
}
