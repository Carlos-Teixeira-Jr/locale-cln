import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import DropdownAdmin from '../../atoms/dropdowns/dropdownAdmin';
import MenuIcon from '../../atoms/icons/menuIcon';
import UserIcon from '../../atoms/icons/userIcon';
import LocaleLogo from '../../atoms/logos/locale';

const AdminHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const { data: session } = useSession() as any;

  // useEffect(() => {
  //   document.addEventListener('click', handleClick);
  //   return () => document.removeEventListener('click', handleClick);
  //   function handleClick(event: any) {
  //     if (ref && ref.current) {
  //       const myRef: any = ref.current;
  //       if (!myRef.contains(event.target)) {
  //         setOpen(false);
  //       }
  //     }
  //   }
  // });

  return (
    <div className="flex flex-row fixed top-0 w-full z-50 justify-between bg-tertiary h-20  drop-shadow-md">
      <Link
        href="/"
        className="relative flex items-center cursor-pointer my-auto ml-4"
      >
        <LocaleLogo />
      </Link>
      <div className="flex flex-row items-center md:px-10">
        <div className="flex items-center mr-2 md:mr-10">
          <Link href={''} className="font-medium text-base text-secondary">
            Precisa de Ajuda?
          </Link>
        </div>
        <div
          className="flex items-center justify-center max-w-[50px] max-h-[50px] cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {session?.user?.data.picture ? (
            <Image
              src={
                session.user?.data.picture
                  ? session.user?.data.picture
                  : session.user.picture
              }
              alt={'User profile picture'}
              width={50}
              height={50}
              className="border border-primary rounded-full w-12 h-12"
            />
          ) : (
            <UserIcon
              className="border border-secondary rounded-full w-12 h-12 p-1 bg-white"
              fill="#F75D5F"
            />
          )}
        </div>
        <div ref={ref as any} onClick={() => setOpen(!open)}>
          <button className="visible md:hidden cursor-pointer decoration-transparent ml-4">
            <MenuIcon />
          </button>
        </div>
      </div>
      {open && <DropdownAdmin />}
    </div>
  );
};

export default AdminHeader;
