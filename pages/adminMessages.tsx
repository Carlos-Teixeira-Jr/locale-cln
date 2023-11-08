import { useEffect, useState } from 'react';
import Pagination from '../components/atoms/pagination/pagination';
import MessagesCard from '../components/molecules/cards/messagesCard.tsx/messagesCard';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';

const AdminMessages: NextPageWithLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="flex">
      {!isMobile && <SideMenu isOwnerProp={false} />}

      <div className="flex-col w-full">
        <h1 className="m-10 text-5xl font-bold leading-[56px] text-quaternary">
          Mensagens
        </h1>

        <div className="flex justify-center">
          <Pagination totalPages={0} />
        </div>

        <div className="flex flex-col justify-center mx-auto">
          <MessagesCard />
        </div>

        <div className="flex justify-center">
          <Pagination totalPages={0} />
        </div>
      </div>
    </main>
  );
};

export default AdminMessages;
