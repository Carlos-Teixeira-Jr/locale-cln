import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import DropdownMenu from '../../atoms/dropdowns/dropdownMenu';
import MenuIcon from '../../atoms/icons/menuIcon';
import UserIcon from '../../atoms/icons/userIcon';
import LocaleLogo from '../../atoms/logos/locale';

export interface IHeader extends React.ComponentPropsWithoutRef<'header'> { }

const Header: React.FC<IHeader> = () => {
  const { data: session } = useSession() as any;
  const router = useRouter();
  const [isBuy, setIsBuy] = useState(false);
  const [isRent, setIsRent] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
    function handleClick(event: any) {
      if (ref && ref.current) {
        const myRef: any = ref.current;
        if (!myRef.contains(event.target)) {
          setOpen(false);
        }
      }
    }
  });

  useEffect(() => {
    const urlType = router.query;

    if (urlType.buyOrRent === 'alugar') {
      setIsRent(true);
      setIsBuy(false);
    } else if (urlType.buyOrRent === 'comprar') {
      setIsBuy(true);
      setIsRent(false);
    }
  }, [router.query]);

  return (
    <div>
      <div className="top-0 fixed z-40 w-[95%] justify-between grid grid-cols-2 md:grid md:grid-cols-3 bg-tertiary h-fit shadow-md mt-8 py-1.5 rounded-[50px] left-1/2 transform -translate-x-1/2">
        <Link
          href="/"
          className="relative flex items-center cursor-pointer my-auto ml-4"
        >
          <LocaleLogo />
        </Link>
        <div className="hidden md:flex md:flex-row md:items-center justify-between space-x-2 text-md ml-5 md:ml-0 font-bold text-quaternary">
          <Link
            className={`cursor-pointer ${isBuy
              ? 'border-b-4  border-red-400'
              : 'hover:border-b-4 border-red-400 hover:border-primary border-transparent transition duration-500'
              }`}
            href="/search?adType=comprar"
          >
            Comprar
          </Link>
          <Link
            className={`cursor-pointer ${isRent
              ? 'border-b-4  border-red-400'
              : 'hover:border-b-4 border-red-400 hover:border-primary border-transparent transition duration-500'
              }`}
            href="/search?adType=alugar"
          >
            Alugar
          </Link>
          <Link
            className="hover:border-b-4 border-red-400 hover:border-primary border-transparent transition duration-500"
            href="/announcement"
          >
            Anunciar
          </Link>
        </div>
        <div className="flex flex-row items-center justify-end">
          {session ? (
            <div className="flex gap-2">
              <Link href={'/admin?page=1'}>
                {session.user.data.picture!! ? (
                  <Image
                    src={session.user?.data.picture!!}
                    alt={'Admin image'}
                    width={50}
                    height={50}
                    className="border border-primary rounded-full w-10 h-10 object-cover"
                  />
                ) : (
                  <UserIcon
                    className="border border-secondary rounded-full w-10 h-10 p-1 bg-white"
                    fill="#F75D5F"
                  />
                )}
              </Link>
              <button
                className="my-auto cursor-pointer mx-2 text-primary font-semibold text-md"
                onClick={() => signOut()}
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="bg-primary justify-self-end cursor-pointer text-tertiary rounded-3xl font-normal py-1 text-xl w-[100px] md:w-[124px] mr-2 shadow-md transition-colors duration-300 hover:bg-red-600 hover:text-white">
                  Entrar
                </button>
              </Link>
              <div ref={ref as any} onClick={() => setOpen(!open)}>
                <button className="visible md:hidden cursor-pointer decoration-transparent">
                  <MenuIcon />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {open && <DropdownMenu />}
    </div>
  );
};

export default Header;
