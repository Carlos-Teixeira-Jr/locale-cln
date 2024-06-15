import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IOwnerData } from '../../../common/interfaces/owner/owner';
import { useIsMobile } from '../../../hooks/useIsMobile';
import DropdownAdmin from '../../atoms/dropdowns/dropdownAdmin';
import MenuIcon from '../../atoms/icons/menuIcon';
import UserIcon from '../../atoms/icons/userIcon';
import LocaleLogo from '../../atoms/logos/locale';

interface IAdminHeader {
  isOwnerProp?: boolean;
  ownerData?: IOwnerData;
  isPlus: boolean
}

const AdminHeader: React.FC<IAdminHeader> = ({ isOwnerProp, ownerData, isPlus }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isOwner = isOwnerProp ? isOwnerProp : false;
  const { data: session } = useSession() as any;
  const [userPicture, setUserPicture] = useState(session?.user?.user?.data?.picture
    ? session?.user?.user?.data?.picture
    : session?.user?.data?.picture
  );
  const ownerPlan = () => {
    if (isOwnerProp && !isPlus && ownerData?.owner && ownerData?.owner?.adCredits > 1) {
      return 'Básico'
    } else if (isPlus) {
      return 'Locale PLUS'
    } else {
      return 'Grátis'
    }
  }

  // Atualiza a foto do usuário caso ela seja alterada na tela de edição de dados do usuário
  useEffect(() => {
    if (ownerData?.user?.picture) {
      const response = async () => {
        const updatedSession = await getSession() as any;
        if (updatedSession) {
          setUserPicture(ownerData?.user?.picture);
        }
      }
      response();
    }
  }, [ownerData])

  return (
    <div className="flex flex-row fixed top-0 w-full z-50 justify-between bg-tertiary h-16 drop-shadow-md">
      <Link
        href="/"
        className="relative flex items-center cursor-pointer my-auto ml-4"
      >
        <LocaleLogo />
      </Link>
      <div className="flex flex-row items-center lg:px-10">
        <div className="flex flex-col justify-start mr-2 md:mr-10 text-quaternary text-sm font-normal">
          <div className='flex gap-2'>
            <h4>Créditos de anúncio disponíveis:</h4>
            <p className='text-primary font-bold'>{ownerData?.owner ? ownerData?.owner?.adCredits : 0}</p>
          </div>
          <div className='flex gap-2'>
            <h4>Créditos de destaque disponíveis:</h4>
            <p className='text-primary font-bold'>{ownerData?.owner ? ownerData?.owner?.highlightCredits : 0}</p>
          </div>
          {ownerData?.owner && (
            <div className='flex gap-2'>
              <h4>Plano atual:</h4>
              <p className='text-primary font-bold'>{ownerPlan()}</p>
            </div>
          )}
        </div>
        <Link href={'/admin?page=1'}>
          <div
            className="flex items-center justify-center max-w-[50px] max-h-[50px] cursor-pointer shrink-0"
            onClick={() => setOpen(!isMobile ? !open : false)}
          >
            {userPicture ? (
              <Image
                src={userPicture}
                alt={'User profile picture'}
                width={50}
                height={50}
                className="border border-primary rounded-full w-8 h-8 md:w-10 md:h-10 object-cover"
              />
            ) : (
              <UserIcon
                className="border border-secondary rounded-full w-8 h-8 md:w-10 md:h-10 p-1 bg-white hover:bg-black hover:opacity-25 transition duration-300 ease-in-out"
                fill="#F75D5F"
              />
            )}
          </div>
        </Link>
        <div ref={ref} onClick={() => setOpen(!open)}>
          <button className="visible lg:hidden cursor-pointer decoration-transparent m-5">
            <MenuIcon width={isMobile ? 24 : 50} height={isMobile ? 24 : 50} />
          </button>
        </div>
      </div>
      {open && <DropdownAdmin isOwnerProp={isOwner} isPlus={isPlus} />}
    </div>
  );
};

export default AdminHeader;
