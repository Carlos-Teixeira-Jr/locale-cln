import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ErrorToastNames, showErrorToast } from '../../../common/utils/toasts';
import { useMenu } from '../../../context/headerMenuContext';
import { useIsMobile } from '../../../hooks/useIsMobile';
import DropdownAdmin from '../../atoms/dropdowns/dropdownAdmin';
import UserIcon from '../../atoms/icons/userIcon';
import Loading from '../../atoms/loading';
import LocaleLogo from '../../atoms/logos/locale';

export interface IHeader {
  userIsOwner: boolean
}

const Header = ({ userIsOwner }: IHeader) => {

  const { menuItems } = useMenu();

  const { data: session } = useSession() as any;
  const router = useRouter();
  const [isBuy, setIsBuy] = useState(false);
  const [isRent, setIsRent] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const isMobile = useIsMobile();

  const headerOptions = [
    {
      id: 'blog',
      title: 'Blog',
      link: '/blog',
      mobile: ['mobile', 'desktop']
    },
    {
      id: 'buy',
      title: 'Comprar',
      link: '/search?adType=comprar',
      mobile: ['desktop']
    },
    {
      id: 'rent',
      title: 'Alugar',
      link: '/search?adType=alugar',
      mobile: ['desktop']
    },
    {
      id: 'announce',
      title: 'Anunciar',
      link: '/announcement',
      mobile: ['mobile', 'desktop']
    },
  ];

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
        className="top-0 fixed z-40 items-center w-[95%] flex justify-evenly bg-tertiary h-fit shadow-md mt-8 py-1.5 rounded-[50px] left-1/2 transform -translate-x-1/2"
      >
        <Link
          href="/"
          className="relative flex items-center cursor-pointer my-auto w-[8rem] justify-center"
          onClick={() => setLogoLoading(true)}
        >
          {logoLoading ? (
            <Loading fill='#F75D5F' className='h-[2rem] w-[2rem] p-1 mx-auto text-gray-200 animate-spin dark:text-gray-600 fill-tertiary' />
          ) : (
            <LocaleLogo width={isMobile ? '100' : '136'} />
          )}
        </Link>

        <div className="text-center flex md:text-start w-full md:flex md:flex-row md:items-center justify-center gap-5 md:gap-20 md:space-x-2 text-md font-bold text-quaternary text-sm md:pr-5 md:mr-auto">
          {headerOptions
            .filter(opt => !isMobile || opt.mobile.includes('mobile'))
            .map((opt) => (
              <Link
                key={opt.id}
                id={opt.id}
                className={`cursor-pointer ${isBuy
                  ? 'border-b-4 border-red-400'
                  : 'hover:border-b-4 border-red-400 hover:border-primary border-transparent transition duration-500'
                  }`}
                href={opt.link}
              >
                {opt.title}
              </Link>
            ))
          }
        </div>

        <div className="flex flex-row items-center justify-end">
          {session ? (
            <div className="flex gap-2">
              <div
                className='cursor-pointer w-8 h-8'
                onClick={() => {
                  setOpen(!open);
                }}
              >
                {!loading ? (
                  session.user.data.picture ? (
                    <Image
                      src={session.user.data.picture}
                      alt={'Admin image'}
                      width={50}
                      height={50}
                      className="border border-primary rounded-full w-8 h-8 md:w-8 md:h-8 object-cover object-center"
                    />
                  ) : (
                    <UserIcon
                      className="border border-secondary rounded-full w-8 h-8 md:w-8 md:h-8 p-1 bg-white"
                      fill="#F75D5F"
                    />
                  )
                ) : null}
              </div>

              {loading && (
                <div className='flex justify-center mr-3'>
                  <Loading fill='#F75D5F' className='h-[2rem] w-[2rem] p-1 text-gray-200 animate-spin dark:text-gray-600 fill-tertiary' />
                </div>
              )}

              <button
                className="my-auto cursor-pointer mx-2 text-primary font-semibold text-md"
                onClick={() => signOut()}
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link href={'/login'}>
                {!loading ? (
                  <button
                    className="bg-primary justify-self-end cursor-pointer text-tertiary rounded-3xl font-normal md:text-xl w-20 md:w-[124px] md:h-[2rem] mr-3 shadow-md transition-colors duration-300 hover:bg-red-600 hover:text-white"
                    onClick={() => {
                      if (router.pathname !== '/login') {
                        setLoading(true);
                      } else {
                        showErrorToast(ErrorToastNames.AlreadyInLoginPage)
                      }
                    }}
                  >
                    Entrar
                  </button>
                ) : (
                  <div className='w-20 flex justify-center mr-3'>
                    <Loading fill='#F75D5F' className='h-[2rem] w-[2rem] text-gray-200 animate-spin dark:text-gray-600 fill-tertiary' />
                  </div>
                )}
              </Link>
            </>
          )}
        </div>
      </div>
      {open && <DropdownAdmin isOwnerProp={userIsOwner} isPlus={false} />}
    </div>
  );
};

export default Header;
