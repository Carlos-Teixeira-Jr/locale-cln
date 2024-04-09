import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';

import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { IMessage } from '../../../common/interfaces/message/messages';
import BellIcon from '../../atoms/icons/bellIcon';
import HeartIcon from '../../atoms/icons/heartIcon';
import MailIcon from '../../atoms/icons/mailIcon';
import MyAnnouncesIcon from '../../atoms/icons/myAnnouncesIcon';
import UserIcon from '../../atoms/icons/userIcon';
import Loading from '../../atoms/loading';
import { INotification } from '../../molecules/cards/notificationCard/notificationCard';

type Options = {
  key: string;
  id: string;
  icon: ReactNode;
  title: string;
  link: string;
};

type SideMenuProps = {
  isOwnerProp?: boolean;
  notifications?: INotification[];
  isMobileProp?: boolean;
  unreadMessages?: IMessage[]
};

const SideMenu: React.FC<SideMenuProps> = ({ isOwnerProp, notifications, unreadMessages }) => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState('');
  const [notReadNots, setNotReadNots] = useState<INotification[]>([]);
  const isOwner = isOwnerProp;
  const [iconToUse, setIconToUse] = useState<ReactJSXElement>();
  const [loadingIconId, setLoadingIconId] = useState('');


  const classNames = {
    notesIcon: 'before:content-[attr(data-nots)] before:text-xs before:bg-tertiary before:font-medium before:text-primary before:border-secondary before:rounded-full before:border before:flex before:items-center before:justify-center before:min-w-[1.4em] before:min-h-[0.4em]'
  }

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

  useEffect(() => {
    if (Array.isArray(notifications)) {
      const notReadNotifications = notifications?.filter(
        (item: any) => !item.isRead
      );
      setNotReadNots(notReadNotifications);
    }
  }, [notifications, setNotReadNots]);

  const options: Options[] = [
    {
      key: 'myAnnounces',
      id: 'my-announces-button',
      icon: (
        <MyAnnouncesIcon
          fill={`${activeButton === 'my-announces-button' ? '#F5BF5D' : '#6B7280'
            }`}
          className="my-auto mr-5"
          width="30"
          height="30"
        />
      ),
      title: 'Meus anúncios',
      link: '/admin',
    },
    {
      key: 'myData',
      id: 'my-data-button',
      icon: (
        <UserIcon
          fill={`${activeButton === 'my-data-button' ? '#F5BF5D' : '#6B7280'}`}
          className="my-auto mr-5"
          width="30"
          height="30"
        />
      ),
      title: 'Meus dados',
      link: '/adminUserData',
    },
    {
      key: 'myFavourites',
      id: 'favourites-button',
      icon: (
        <HeartIcon
          fill={`${activeButton === 'favourites-button' ? '#F5BF5D' : '#6B7280'
            }`}
          className="my-auto mr-5"
          width="30"
          height="30"
        />
      ),
      title: 'Meus favoritos',
      link: '/adminFavProperties',
    },
    {
      key: 'myMessages',
      id: 'messages-button',
      icon: (
        <div className="flex items-center justify-around pr-5">
          <MailIcon
            fill={`${activeButton === 'messages-button' ? '#F5BF5D' : '#6B7280'}`}
            className="my-auto"
            width="30"
            height="30"
          />
          <div className="absolute top-100 mt-4 ml-[0.4rem] left-10">
            <div
              data-nots={unreadMessages?.length! > 0 ? unreadMessages?.length : 0}
              id={'messages-value'}
              className={classNames.notesIcon}
            ></div>
          </div>
        </div>
      ),
      title: 'Minhas mensagens',
      link: '/adminMessages',
    },
    {
      key: 'myNotifications',
      id: 'notifications-button',
      icon: (
        <div className="flex items-center justify-around pr-5">
          <BellIcon
            fill={`${activeButton === 'notifications-button' ? '#F5BF5D' : '#6B7280'
              }`}
            className="my-auto"
            width="30"
            height="30"
          />
          <div className="absolute top-100 mt-4 ml-[0.4rem] left-10">
            <div
              data-nots={notReadNots?.length > 0 ? notReadNots?.length : 0}
              id={'notifications-value'}
              className={classNames.notesIcon}
            ></div>
          </div>
        </div>
      ),
      title: 'Minhas notificações',
      link: '/adminNotifications',
    },
  ];

  return (
    <>
      <div className="w-fit h-screen bg-tertiary px-2 mt-10 drop-shadow-xl left-0">
        {/* {isOwnerProp !== undefined && notifications !== undefined && options.map(({ key, id, icon, title, link }: Options) => {
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
                  onClick={() => {
                    setActiveButton(id);
                    setLoadingIconId(id);
                    //setIconToUse(<Loading />)
                  }}
                >
                  {iconToUse ? iconToUse : icon}
                  <h2
                    className={`text-md font-bold leading-7 my-auto transition-colors duration-300 ${activeButton === id
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
        })} */}

        {isOwnerProp !== undefined && notifications !== undefined && options.map(({ key, id, icon, title, link }: Options) => {
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
                  onClick={() => {
                    setActiveButton(id);
                    setLoadingIconId(id); // Define o ID do ícone que está em loading
                  }}
                >
                  {/* {loadingIconId === id ? <Loading /> : icon} */}
                  {loadingIconId === id ? <Loading fill='#F5BF5D' /> : icon}
                  <h2
                    className={`text-md ml font-bold leading-7 my-auto transition-colors duration-300 ${activeButton === id
                      ? `text-secondary hover:text-yellow ${loadingIconId !== id ?
                        '' :
                        'md:ml-[18px]'
                      }`
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


        {isOwnerProp !== undefined && notifications !== undefined && (
          <div className="flex justify-center mt-10">
            <Link href={'/register'}>
              <button className="bg-primary rounded-[30px] text-tertiary text-lg font-bold leading-6 px-10 py-2.5 transition-colors duration-300 hover:bg-red-600 hover:text-white">
                {isOwner ? 'Novo Anúncio' : 'Anunciar'}
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenu;
