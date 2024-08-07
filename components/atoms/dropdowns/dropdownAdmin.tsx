import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMenu } from '../../../context/headerMenuContext';
import Loading from '../loading';

interface IDropdownAdmin {
  isOwnerProp: boolean;
  isPlus: boolean
}

export default function DropdownAdmin({ isOwnerProp, isPlus }: IDropdownAdmin) {

  const isOwner = isOwnerProp;
  const { pathname, push } = useRouter();
  const [loadingOption, setLoadingOption] = useState<string | null>(null);
  const optionsClassname =
    'translate-x-[1px] w-[150px] h-fit hover:bg-quaternary hover:text-tertiary py-3 flex justify-center mx-auto';

  const { menuItems } = useMenu()

  const handleClick = (key: string, ref: string) => {
    const baseRef = ref.split('?')[0];
    if (baseRef !== pathname) {
      setLoadingOption(key);
      push(ref)
    }
  };

  const option = [
    {
      key: 'myAnnouncements',
      title: 'Meus Anúncios',
      ref: '/admin?page=1',
      className: optionsClassname,
      ownerOption: true,
    },
    {
      key: 'myData',
      title: 'Meus Dados',
      ref: '/adminUserData?page=1',
      className: optionsClassname,
      ownerOption: true,
    },
    {
      key: 'myFavourites',
      title: 'Favoritos',
      ref: '/adminFavProperties?page=1',
      className: optionsClassname,
      ownerOption: true,
    },
    {
      key: 'myMessages',
      title: 'Mensagens',
      ref: '/adminMessages?page=1',
      className: optionsClassname,
      ownerOption: false,
    },
    {
      key: 'myNotifications',
      title: 'Notificações',
      ref: '/adminNotifications?page=1',
      className: optionsClassname,
      ownerOption: true,
    },
    {
      key: 'newAnnouncement',
      title: 'Novo Anúncio',
      ref: '/register',
      className: optionsClassname,
      ownerOption: true,
    },
    {
      key: 'creditShop',
      title: 'Comprar créditos',
      ref: '/creditsShop',
      className: optionsClassname,
      ownerOption: isPlus ? false : true,
    },
  ];

  return (
    <div className={`flex z-50 max-w h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${pathname.includes('admin') ? 'top-[66px] absolute right-1' : 'top-[4.9rem] right-8 fixed'}`}>
      <div className="flex flex-col text-center font-medium text-md text-quaternary leading-5">

        {menuItems.ownerProperties?.count !== undefined && menuItems.ownerProperties?.count > 0 && (
          <div
            onClick={() => handleClick('myAnnouncements', '/admin?page=1')}
            className={
              pathname === '/admin'
                ? optionsClassname + ' rounded-t-xl' + `${loadingOption === 'myAnnouncements' ? 'py-0' : ''}`
                : optionsClassname + `${loadingOption === 'myAnnouncements' ? 'py-0' : ''}`
            }
          >
            {loadingOption === 'myAnnouncements' && '/admin' !== pathname ? (
              <Loading fill='#F75D5F' />
            ) : (
              'Meus Anúncios'
            )}
          </div>
        )}


        <div
          onClick={() => handleClick('myData', '/adminUserData?page=1')}
          className={
            pathname === '/adminUserData'
              ? optionsClassname + ' rounded-t-xl' + `${loadingOption === 'myData' ? 'py-0' : ''}`
              : optionsClassname + `${loadingOption === 'myData' ? 'py-0' : ''}`
          }
        >
          {loadingOption === 'myData' && '/adminUserData' !== pathname ? (
            <Loading fill='#F75D5F' />
          ) : (
            'Meus Dados'
          )}
        </div>

        {!Array.isArray(menuItems.notifications) && (
          <div
            onClick={() => handleClick('myFavourites', '/adminFavProperties?page=1')}
            className={
              pathname === '/adminFavProperties'
                ? optionsClassname + ' rounded-t-xl' + `${loadingOption === 'myFavourites' ? 'py-0' : ''}`
                : optionsClassname + `${loadingOption === 'myFavourites' ? 'py-0' : ''}`
            }
          >
            {loadingOption === 'myFavourites' && '/adminFavProperties' !== pathname ? (
              <Loading fill='#F75D5F' />
            ) : (
              'Favoritos'
            )}
          </div>
        )}

        {menuItems.ownerProperties?.count !== undefined && menuItems.ownerProperties.messages?.length > 0 && (
          <div
            onClick={() => handleClick('myMessages', '/adminMessages?page=1')}
            className={
              pathname === '/adminMessages'
                ? optionsClassname + ' rounded-t-xl' + `${loadingOption === 'myMessages' ? 'py-0' : ''}`
                : optionsClassname + `${loadingOption === 'myMessages' ? 'py-0' : ''}`
            }
          >
            {loadingOption === 'myMessages' && '/adminMessages' !== pathname ? (
              <Loading fill='#F75D5F' />
            ) : (
              'Mensagens'
            )}
          </div>
        )}

        {menuItems.notifications && menuItems.notifications?.length > 0 && (
          <div
            onClick={() => handleClick('myNotifications', '/adminMessages?page=1')}
            className={
              pathname === '/adminNotifications'
                ? optionsClassname + ' rounded-t-xl' + `${loadingOption === 'myNotifications' ? 'py-0' : ''}`
                : optionsClassname + `${loadingOption === 'myNotifications' ? 'py-0' : ''}`
            }
          >
            {loadingOption === 'myNotifications' && '/adminNotifications' !== pathname ? (
              <Loading fill='#F75D5F' />
            ) : (
              'Notificações'
            )}
          </div>
        )}

        {isPlus && (
          <div
            onClick={() => handleClick('creditShop', '/creditsShop')}
            className={
              pathname === '/creditsShop'
                ? optionsClassname + ' rounded-t-xl' + `${loadingOption === 'creditShop' ? 'py-0' : ''}`
                : optionsClassname + `${loadingOption === 'creditShop' ? 'py-0' : ''}`
            }
          >
            {loadingOption === 'creditShop' && '/creditsShop' !== pathname ? (
              <Loading fill='#F75D5F' />
            ) : (
              'Comprar créditos'
            )}
          </div>
        )}

        <div
          onClick={() => handleClick('newAnnouncement', '/register')}
          className={
            pathname === '/register'
              ? optionsClassname + ' rounded-t-xl' + `${loadingOption === 'newAnnouncement' ? 'py-0' : ''}`
              : optionsClassname + `${loadingOption === 'newAnnouncement' ? 'py-0' : ''}`
          }
        >
          {loadingOption === 'newAnnouncement' && '/register' !== pathname ? (
            <Loading fill='#F75D5F' />
          ) : (
            'Novo Anúncio'
          )}
        </div>

        <button
          className={'translate-x-[1px] w-[150px] h-[50px] text-primary text-sm hover:bg-quaternary hover:text-tertiary py-3'}
          onClick={() => signOut()}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
