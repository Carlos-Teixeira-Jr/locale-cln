import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import DropdownAdmin from '../../atoms/dropdowns/dropdownAdmin';
import MenuIcon from '../../atoms/icons/menuIcon';
import UserIcon from '../../atoms/icons/userIcon';
import LocaleLogo from '../../atoms/logos/locale';

interface IAdminHeader {
  isOwnerProp?: boolean;
}

const AdminHeader: React.FC<IAdminHeader> = ({ isOwnerProp }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isOwner = isOwnerProp ? isOwnerProp : false;
  const { data: session } = useSession() as any;

  return (
    <div className="flex flex-row fixed top-0 w-full z-50 justify-between bg-tertiary h-20 drop-shadow-md">
      <Link
        href="/"
        className="relative flex items-center cursor-pointer my-auto ml-4"
      >
        <LocaleLogo />
      </Link>
      <div className="flex flex-row items-center lg:px-10">
        <div className="flex items-center mr-2 md:mr-10">
          {/* <Link href={''} className="font-medium text-base text-secondary">
            Precisa de Ajuda?
          </Link> */}
        </div>
        <Link href={'/admin?page=1'}>
          <div
            className="flex items-center justify-center max-w-[50px] max-h-[50px] cursor-pointer shrink-0"
            onClick={() => setOpen(!isMobile ? !open : false)}
          >
            {session?.user?.image ? (
              <Image
                src={session?.user?.image}
                alt={'User profile picture'}
                width={50}
                height={50}
                className="border border-primary rounded-full w-12 h-12"
              />
            ) : (
              <UserIcon
                className="border border-secondary rounded-full w-12 h-12 p-1 bg-white hover:bg-black hover:opacity-25 transition duration-300 ease-in-out"
                fill="#F75D5F"
              />
            )}
          </div>
        </Link>
        <div ref={ref} onClick={() => setOpen(!open)}>
          <button className="visible lg:hidden cursor-pointer decoration-transparent mx-5">
            <MenuIcon width={isMobile ? 24 : 50} height={isMobile ? 24 : 50} />
          </button>
        </div>
      </div>
      {open && <DropdownAdmin isOwnerProp={isOwner} />}
    </div>
  );
};

export default AdminHeader;
