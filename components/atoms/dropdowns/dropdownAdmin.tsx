import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function DropdownAdmin() {

  const option = [
    {
      key: 'myAnnouncements',
      title: 'Meus Anúncios',
      ref: '/admin',
      className: 'translate-x-[1px]  w-[150px] h-[50px]  hover:bg-quaternary hover:text-tertiary py-3',
    },
    {
      key: 'myData',
      title: 'Meus Dados',
      ref: '/adminUserData',
      className: 'translate-x-[1px]  w-[150px] h-[50px]  hover:bg-quaternary hover:text-tertiary py-3',
    },
    {
      key: 'myFavourites',
      title: 'Favoritos',
      ref: '/adminFavProperties',
      className: 'translate-x-[1px]  w-[150px] h-[50px]  hover:bg-quaternary hover:text-tertiary py-3',
    },
    {
      key: 'myMessages',
      title: 'Mensagens',
      ref: '/adminMessages',
      className: 'translate-x-[1px]  w-[150px] h-[50px]  hover:bg-quaternary hover:text-tertiary py-3',
    },
    {
      key: 'myNotifications',
      title: 'Notificações',
      ref: '/adminNotifications',
      className: 'translate-x-[1px]  w-[150px] h-[50px]  hover:bg-quaternary hover:text-tertiary py-3',
    },
    {
      key: 'newAnnouncement',
      title: 'Novo Anúncio',
      ref: '/register',
      className: 'translate-x-[1px]  w-[150px] h-[50px]  hover:bg-quaternary hover:text-tertiary py-3',
    },
    {
      key: 'logOut',
      title: 'Sair',
      ref: '',
      className: 'translate-x-[1px] w-[150px] h-[50px] text-primary hover:bg-quaternary hover:text-tertiary py-3',
    },
  ]

  return (
    <div className="flex absolute z-50 top-[82px] right-1 max-w-[150px] h-[300px] rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md">
      <div className="flex flex-col text-center font-medium text-base text-quaternary leading-5">
        {option.map((option, idx) => (
          option.key !== 'logOut' ? (
            <Link
              key={option.key}
              href={option.ref}
              className={idx === 0 ? option.className + 'rounded-t-xl' : option.className}
            >
              {option.title}
            </Link>
          ) : (
            <button key={option.key} className={option.className} onClick={() => signOut()}>Sair</button>
          )
        ))}
      </div>
    </div>
  );
}
