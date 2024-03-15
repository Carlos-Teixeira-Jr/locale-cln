import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface IDropdownAdmin {
  isOwnerProp: boolean;
}

export default function DropdownAdmin({ isOwnerProp }: IDropdownAdmin) {
  const isOwner = isOwnerProp;
  const optionsClassname =
    'translate-x-[1px] w-[150px] h-fit hover:bg-quaternary hover:text-tertiary py-3 ';

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
      ownerOption: false,
    },
    {
      key: 'myFavourites',
      title: 'Favoritos',
      ref: '/adminFavProperties?page=1',
      className: optionsClassname,
      ownerOption: false,
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
      ownerOption: false,
    },
    {
      key: 'newAnnouncement',
      title: 'Novo Anúncio',
      ref: '/register',
      className: optionsClassname,
      ownerOption: false,
    },
    {
      key: 'logOut',
      title: 'Sair',
      ref: '/index',
      className:
        'translate-x-[1px] w-[150px] h-[50px] text-primary text-sm hover:bg-quaternary hover:text-tertiary py-3',
    },
  ];

  return (
    <div className="flex absolute z-50 top-[66px] right-1 max-w-[150px] max-w h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md">
      <div className="flex flex-col text-center font-medium text-md text-quaternary leading-5">
        {!isOwner
          ? option.map((option, index) => {
            if (!option.ownerOption) {
              return option.key !== 'logOut' ? (
                <Link
                  key={option.key}
                  href={option.ref}
                  className={
                    index === 0
                      ? option.className + ' rounded-t-xl'
                      : option.className
                  }
                >
                  {option.title}
                </Link>
              ) : (
                <button
                  key={option.key}
                  className={option.className}
                  onClick={() => signOut()}
                >
                  Sair
                </button>
              );
            }
          })
          : option.map((option, index) => {
            return option.key !== 'logOut' ? (
              <Link
                key={option.key}
                href={option.ref}
                className={
                  index === 0
                    ? option.className + 'rounded-t-xl'
                    : option.className
                }
              >
                {option.title}
              </Link>
            ) : (
              <button
                key={option.key}
                className={option.className}
                onClick={() => signOut()}
              >
                Sair
              </button>
            );
          })}
      </div>
    </div>
  );
}
