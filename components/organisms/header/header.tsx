import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import DropdownMenu from '../../atoms/dropdowns/dropdownMenu';
import MenuIcon from '../../atoms/icons/menuIcon';
import UserIcon from '../../atoms/icons/userIcon';
import Loading from '../../atoms/loading';
import LocaleLogo from '../../atoms/logos/locale';

export interface IHeader extends React.ComponentPropsWithoutRef<'header'> { }

const Header: React.FC<IHeader> = () => {
  const { data: session } = useSession() as any;
  const router = useRouter();
  const [isBuy, setIsBuy] = useState(false);
  const [isRent, setIsRent] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

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
      <div
        // className="top-0 fixed z-40 w-[95%] justify-between grid grid-cols-2 md:grid md:grid-cols-3 bg-tertiary h-fit shadow-md mt-8 py-1.5 rounded-[50px] left-1/2 transform -translate-x-1/2"
        className="top-0 fixed z-40 items-center w-[95%] justify-between grid grid-cols-3 bg-tertiary h-fit shadow-md mt-8 py-1.5 rounded-[50px] left-1/2 transform -translate-x-1/2"
      >
        <Link
          href="/"
          className="relative flex items-center cursor-pointer my-auto"
        >
          <LocaleLogo width={isMobile ? '100' : '136'} />
        </Link>
        <div className="text-center md:text-start w-full md:flex md:flex-row md:items-center justify-between space-x-2 text-md font-bold text-quaternary text-sm md:pr-5 md:mr-auto">
          {!isMobile && (
            <>
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
            </>
          )}

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
              <Link href={'/admin?page=1'} onClick={() => setLoading(true)}>
                {!loading ? (
                  session.user.data.picture ? (
                    <Image
                      src={session.user.data.picture}
                      alt={'Admin image'}
                      width={50}
                      height={50}
                      className="border border-primary rounded-full w-8 h-8 md:w-8 md:h-8 object-cover"
                    />
                  ) : (
                    <UserIcon
                      className="border border-secondary rounded-full w-8 h-8 md:w-8 md:h-8 p-1 bg-white"
                      fill="#F75D5F"
                    />
                  )
                ) : null}
              </Link>

              {loading && <Loading fill='#F75D5F' className='h-[2rem] w-[2rem] p-1 text-gray-200 animate-spin dark:text-gray-600 fill-tertiary' />}

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
                {!loading ? (
                  <button className="bg-primary justify-self-end cursor-pointer text-tertiary rounded-3xl font-normal md:py-1 md:text-xl w-20 md:w-[124px] md:h-[2rem] mr-2 shadow-md transition-colors duration-300 hover:bg-red-600 hover:text-white" onClick={() => setLoading(true)}>
                    Entrar
                  </button>
                ) : (
                  <div className='w-20'>
                    <Loading fill='#F75D5F' className='h-[2rem] w-[2rem] text-gray-200 animate-spin dark:text-gray-600 fill-tertiary' />
                  </div>
                )}

              </Link>
              <div className='flex items-center' ref={ref as any} onClick={() => setOpen(!open)}>
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
