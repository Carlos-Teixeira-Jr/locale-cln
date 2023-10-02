import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import DropdownMenu from '../../atoms/dropdowns/dropdownMenu';
import MenuIcon from '../../atoms/icons/menuIcon';
import LocaleLogo from '../../atoms/logos/locale';

export interface IHeader extends React.ComponentPropsWithoutRef<'header'> {}

const Header: React.FC<IHeader> = () => {
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

    if (urlType.buyOrRent === 'aluguel') {
      setIsRent(true);
      setIsBuy(false);
    } else if (urlType.buyOrRent === 'venda') {
      setIsBuy(true);
      setIsRent(false);
    }
  }, [router.query]);

  return (
    <div>
      <div className="sticky top-0 w-auto z-10 justify-between flex flex-row bg-tertiary h-14 shadow-md mr-6 ml-6 mt-8 p-2 rounded-[50px]">
        <Link
          href="/"
          className="relative flex items-center cursor-pointer my-auto ml-4"
        >
          <LocaleLogo />
        </Link>
        <div className="hidden lg:flex lg:flex-row lg:items-center justify-between space-x-8 text-lg ml-5 md:ml-0 font-bold text-quaternary">
          <Link
            className={`cursor-pointer ${
              isBuy
                ? 'border-b-4  border-red-400'
                : 'hover:border-b-4  border-red-400'
            }`}
            href="/search?buyOrRent=venda"
          >
            Comprar
          </Link>
          <Link
            className={`cursor-pointer ${
              isRent
                ? 'border-b-4  border-red-400'
                : 'hover:border-b-4  border-red-400'
            }`}
            href="/search?buyOrRent=aluguel"
          >
            Alugar
          </Link>
          <Link
            className="hover:border-b-4 border-red-400 cursor-pointer"
            href="/announcement"
          >
            Anunciar
          </Link>
        </div>
        <div className="flex flex-row items-center justify-end ">
          <Link href="/login">
            <button className="bg-primary justify-self-end cursor-pointer text-tertiary rounded-3xl font-normal py-1 text-xl w-[100px] md:w-[124px] mr-2 shadow-md">
              Entrar
            </button>
          </Link>
          <div ref={ref as any} onClick={() => setOpen(!open)}>
            <button className="visible md:hidden cursor-pointer decoration-transparent">
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>
      {open && <DropdownMenu />}
    </div>
  );
};
export default Header;
