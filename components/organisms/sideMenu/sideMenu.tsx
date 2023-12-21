import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';

import { useIsMobile } from '../../../hooks/useIsMobile';
import BellIcon from '../../atoms/icons/bellIcon';
import HeartIcon from '../../atoms/icons/heartIcon';
import MailIcon from '../../atoms/icons/mailIcon';
import MyAnnouncesIcon from '../../atoms/icons/myAnnouncesIcon';
import UserIcon from '../../atoms/icons/userIcon';
import SettingsIcon from '../../atoms/icons/settingsIcon';

type Options = {
  key: string;
  id: string;
  icon: ReactNode;
  title: string;
  link: string;
};

type SideMenuProps = {
  isOwnerProp?: boolean;
  notifications?: [];
  isMobileProp?: boolean;
};

const SideMenu: React.FC<SideMenuProps> = ({ isOwnerProp, notifications }) => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState('');
  const isMobile = useIsMobile();
  const isOwner = isOwnerProp;

  useEffect(() => {
    const path = router.pathname;
    const messageIdPath = 'message';

    if (path === '/admin') {
      setActiveButton(isOwner ? 'my-announces-button' : 'favourites-button');
    } else if (path === '/adminUserData') {
      setActiveButton('my-data-button');
    } else if (path === '/adminFavProperties') {
      setActiveButton('favourites-button');
    } else if (path === '/adminMessages' || path.includes(messageIdPath)) {
      setActiveButton('messages-button');
    } else if (path === '/adminNotifications') {
      setActiveButton('notifications-button');
    }
  }, [router.pathname, isOwner]);

  const options: Options[] = [
    {
      key: 'myAnnounces',
      id: 'my-announces-button',
      icon: (
        <MyAnnouncesIcon
          fill={`${
            activeButton === 'my-announces-button' ? '#F5BF5D' : '#6B7280'
          }`}
          className="my-auto mr-5"
          width="35"
          height="35"
        />
      ),
      title: 'Meus Anúncios',
      link: '/admin',
    },
    {
      key: 'myData',
      id: 'my-data-button',
      icon: (
        <UserIcon
          fill={`${activeButton === 'my-data-button' ? '#F5BF5D' : '#6B7280'}`}
          className="my-auto mr-5"
          width="35"
          height="35"
        />
      ),
      title: 'Meus Dados',
      link: '/adminUserData',
    },
    {
      key: 'myFavourites',
      id: 'favourites-button',
      icon: (
        <HeartIcon
          fill={`${
            activeButton === 'favourites-button' ? '#F5BF5D' : '#6B7280'
          }`}
          className="my-auto mr-5"
          width="35"
          height="35"
        />
      ),
      title: 'Meus Favoritos',
      link: '/adminFavProperties',
    },
    {
      key: 'myMessages',
      id: 'messages-button',
      icon: (
        <MailIcon
          fill={`${activeButton === 'messages-button' ? '#F5BF5D' : '#6B7280'}`}
          className="my-auto mr-5"
          width="35"
          height="35"
        />
      ),
      title: 'Minhas Mensagens',
      link: '/adminMessages',
    },
    {
      key: 'myNotifications',
      id: 'notifications-button',
      icon: (
        <div className="flex items-center justify-around pr-5">
          <BellIcon
            fill={`${
              activeButton === 'notifications-button' ? '#F5BF5D' : '#6B7280'
            }`}
            className="my-auto"
            width="35"
            height="35"
          />
          {notifications && notifications?.length > 0 && (
            <div className="absolute top-100 mt-4 ml-[0.4rem] left-10">
              <div
                data-nots={notifications?.length}
                id={'notifications-value'}
                className="before:content-[attr(data-nots)] before:text-xs before:bg-tertiary before:font-medium before:text-primary before:border-secondary before:rounded-full before:border before:flex before:items-center before:justify-center before:min-w-[1.4em] before:min-h-[0.4em]"
              ></div>
            </div>
          )}
        </div>
      ),
      title: 'Minhas Notificações',
      link: '/adminNotifications',
    },
  ];

  return (
    <>
      {!isMobile && (
        <div className="w-fit min-h-screen bg-tertiary px-2 drop-shadow-xl left-0">
          {options.map(({ key, id, icon, title, link }: Options) => {
            if (
              isOwner ||
              id === 'favourites-button' ||
              id === 'notifications-button' ||
              id === 'my-data-button'
            ) {
              return (
                <div
                  key={key}
                  onClick={() => {
                    router.push({
                      pathname: link,
                      query: {
                        page: 1,
                      },
                    });
                  }}
                >
                  <button
                    className="flex mx-5 py-1.5"
                    onClick={() => setActiveButton(id)}
                  >
                    {icon}
                    <h2
                      className={`text-xl font-bold leading-7 my-auto transition-colors duration-300 ${
                        activeButton === id
                          ? 'text-secondary hover:text-yellow'
                          : 'text-quaternary hover:text-gray-700'
                      }`}
                    >
                      {title}
                    </h2>
                  </button>
                </div>
              );
            }
            return null;
          })}

          <div className="flex justify-center mt-10">
            <Link href={'/register'}>
              <button className="bg-primary rounded-[30px] text-tertiary text-xl font-bold leading-6 px-10 py-5 transition-colors duration-300 hover:bg-red-600 hover:text-white">
                {isOwner ? 'Novo Anúncio' : 'Anunciar'}
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;
