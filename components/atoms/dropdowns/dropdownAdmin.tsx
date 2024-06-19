import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Loading from '../loading';

interface IDropdownAdmin {
  isOwnerProp: boolean;
  isPlus: boolean
}

export default function DropdownAdmin({ isOwnerProp, isPlus }: IDropdownAdmin) {

  const isOwner = isOwnerProp;
  const { pathname } = useRouter();
  const [loadingOption, setLoadingOption] = useState<string | null>(null);
  const optionsClassname =
    'translate-x-[1px] w-[150px] h-fit hover:bg-quaternary hover:text-tertiary py-3 flex justify-center';

  const handleClick = (key: string) => {
    setLoadingOption(key);
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
      ref: '/adminUserData',
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

        {option.map((option, idx) => {
          if (!isOwner && !isPlus) {
            return option.key !== 'creditShop' && option.key !== 'myMessages' && option.key !== 'myAnnouncements' && (
              <Link
                key={option.key}
                href={option.ref}
                onClick={() => handleClick(option.key)}
                className={
                  idx === 0
                    ? option.className + ' rounded-t-xl'
                    : option.className
                }
              >
                {loadingOption === option.key ? (
                  <Loading fill='#F75D5F' />
                ) : (
                  option.title
                )}
              </Link>
            )
          } else if (isOwner && !isPlus) {
            return option.key !== 'creditShop' && (
              <Link
                key={option.key}
                href={option.ref}
                onClick={() => handleClick(option.key)}
                className={
                  idx === 0
                    ? option.className + ' rounded-t-xl'
                    : option.className
                }
              >
                {loadingOption === option.key ? (
                  <Loading fill='#F75D5F' />
                ) : (
                  option.title
                )}
              </Link>
            )
          } else if (isOwner && isPlus) {
            return (
              <Link
                key={option.key}
                href={option.ref}
                onClick={() => handleClick(option.key)}
                className={
                  idx === 0
                    ? option.className + ' rounded-t-xl'
                    : option.className
                }
              >
                {loadingOption === option.key ? (
                  <Loading fill='#F75D5F' />
                ) : (
                  option.title
                )}
              </Link>
            )
          } else if (!isOwner && isPlus) {
            return option.key !== 'myMessages' && option.key !== 'myAnnouncements' && (
              <Link
                key={option.key}
                href={option.ref}
                onClick={() => handleClick(option.key)}
                className={
                  idx === 0
                    ? option.className + ' rounded-t-xl'
                    : option.className
                }
              >
                {loadingOption === option.key ? (
                  <Loading fill='#F75D5F' />
                ) : (
                  option.title
                )}
              </Link>
            )
          }
        })}

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
