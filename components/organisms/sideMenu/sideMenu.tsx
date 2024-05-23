import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { IMessage } from '../../../common/interfaces/message/messages';
import BellIcon from '../../atoms/icons/bellIcon';
import CartIcon from '../../atoms/icons/cartIcon';
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
  cases: string[];
};

type SideMenuProps = {
  isOwnerProp?: boolean;
  notifications?: INotification[];
  isMobileProp?: boolean;
  unreadMessages?: IMessage[];
  isPlus: boolean;
  hasProperties: boolean
};

const SideMenu: React.FC<SideMenuProps> = ({
  isOwnerProp,
  notifications,
  unreadMessages,
  isPlus,
  hasProperties
}) => {

  const router = useRouter();
  const [activeButton, setActiveButton] = useState('');
  const [notReadNots, setNotReadNots] = useState<INotification[]>([]);
  const isOwner = isOwnerProp;
  const [loadingIconId, setLoadingIconId] = useState('');
  const [loading, setLoading] = useState(false);

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
    } else if (isPlus && path === '/creditsShop') {
      setActiveButton('credits-shop')
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
      cases: hasProperties ? ['owner', 'plus'] : []
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
      cases: ['user', 'owner', 'plus']
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
      cases: ['user', 'owner', 'plus']
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
      cases: ['owner', 'plus']
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
      cases: ['user', 'owner', 'plus']
    },
    {
      key: 'creditsShop',
      id: 'credits-shop',
      icon: (
        <CartIcon
          fill={`${activeButton === 'credits-shop' ? '#F5BF5D' : '#6B7280'
            }`}
          className="my-auto mr-5"
          width="30"
          height="30"
        />
      ),
      title: 'Comprar créditos',
      link: '/creditsShop',
      cases: ['plus']
    },
  ];

  return (
    <>
      <div className="w-fit h-screen bg-tertiary px-2 mt-9 drop-shadow-xl left-0">
        {options.map((option: Options) => {
          const shouldRender =
            (isOwner && option.cases.includes('owner')) ||
            (!isOwner && option.cases.includes('user')) ||
            (
              isPlus &&
              option.cases.includes('plus')
              // (isOwner || option.cases.includes('owner'))
            );
          if (shouldRender) {
            return (
              <div
                key={option.key}
                onClick={() => {
                  router.push({
                    pathname: option.link,
                    query: { page: 1 },
                  });
                }}
              >
                <button
                  className="flex mx-5 py-1.5"
                  onClick={() => {
                    setActiveButton(option.id);
                    setLoadingIconId(option.id);
                  }}
                >
                  {loadingIconId === option.id ? <Loading fill="#F5BF5D" /> : option.icon}
                  <h2
                    className={`text-md ml font-bold leading-7 my-auto transition-colors duration-300 ${activeButton === option.id
                      ? `text-secondary hover:text-yellow ${loadingIconId !== option.id ? '' : 'md:ml-[18px]'}`
                      : 'text-quaternary hover:text-gray-700'
                      }`}
                  >
                    {option.title}
                  </h2>
                </button>
              </div>
            );
          } else {
            return null;
          }
        })}

        {isOwnerProp !== undefined && notifications !== undefined && (
          <div className="flex justify-center mt-10">
            <Link href={'/register'} onClick={() => setLoading(true)}>
              <button
                className={`flex items-center flex-row justify-center w-[209px] h-14 px-5 text-tertiary rounded-full font-semibold text-md md:text-lg ${loading ?
                  'bg-red-300 transition-colors duration-300' :
                  'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
                  }`}
              >
                <span className={`${loading ? 'mr-5' : ''}`}>{isOwner ? 'Novo Anúncio' : 'Anunciar'}</span>
                {loading && <Loading />}
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenu;
