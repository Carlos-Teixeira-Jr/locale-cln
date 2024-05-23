import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { toast } from 'react-toastify';
import { ErrorToastNames, showErrorToast } from '../../../common/utils/toasts';
import CloseIcon from '../icons/closeIcon';
import Loading from '../loading';
ReactModal.setAppElement('#__next');

interface IConfirmActivationModal {
  isOpen: boolean;
  setModalIsOpen: (value: boolean) => void;
  isActiveProp: boolean;
  propertyIdProp: string;
}

export default function confirmActivationModal({
  isOpen,
  setModalIsOpen,
  isActiveProp,
  propertyIdProp,
}: IConfirmActivationModal) {

  const [isMobile, setIsMobile] = useState(false);
  const [isActive, _setIsActive] = useState<boolean>(isActiveProp);
  const [propertyId, _setPropertyId] = useState<string[]>([propertyIdProp]);
  const { data: session } = useSession() as any;
  const userId = session?.user?.data._id;
  const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleIsActive = async () => {
    try {
      toast.loading('Desativando anúncio...');
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/property/property-activation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId: propertyId,
            isActive: !isActive,
            userId,
          }),
        }
      );

      if (response.ok) {
        toast.dismiss();
        window.location.reload();
      } else {
        toast.dismiss();
        setLoading(false)
        if (!isActive) {
          showErrorToast(ErrorToastNames.AdActivation);
        } else {
          showErrorToast(ErrorToastNames.AdDeActivation);
        }
      }
    } catch (error) {
      toast.dismiss();
      setLoading(false)
      showErrorToast(ErrorToastNames.ServerConnection)
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Verify email modal"
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          zIndex: 99,
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          border: '1px solid #ccc',
          background: 'rgb(247 247 246)',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '30px',
          outline: 'none',
          padding: '20px',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          width: isMobile ? '90%' : 'auto',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <div className="text-center">
        <div className="flex flex-col">
          <div>
            <div className="w-fit float-right">
              <CloseIcon
                onClick={() => setModalIsOpen(false)}
                fill="#6B7280"
                className="float-right cursor-pointer"
              />
            </div>
          </div>

          <Image
            src={'/images/Logo_Locale_HD.png'}
            alt={'Locale imóveis logomarca'}
            width={300}
            height={150}
            className="mx-auto"
          />
        </div>

        <h1 className="text-xl font-bold mb-4 text-primary">{`Você tem certeza que quer ${isActive ? 'inativar' : 'reativar'
          } este anúncio?`}</h1>
        <p className="font-bold text-xs text-quaternary mb-4">
          {isActive
            ? 'Se decidir reativá-lo no futuro, será necessário utilizar um crédito de anúncio do seu plano. 😉'
            : 'Tem certeza de que deseja reativar o anúncio? Lembre-se de que a reativação custa um crédito do seu plano. 😊'}
        </p>
        <button
          // className="md:w-[75%] h-[50px] flex justify-center bg-primary p-2.5 rounded-[50px] font-normal text-xl text-tertiary leading-6 mx-auto mt-5 transition-colors duration-300 hover:bg-red-600 hover:text-white"
          className={`flex items-center flex-row justify-center w-[75%] md:w-1/2 h-14 text-tertiary rounded-full mx-auto font-bold text-lg md:text-xl ${loading ?
            'bg-red-300 transition-colors duration-300' :
            'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
            }`}
          onClick={handleIsActive}
          disabled={loading}
        >
          <span className={`${loading ? 'mr-5' : ''}`}>Continuar</span>
          {loading && <Loading />}
        </button>
      </div>
    </ReactModal>
  );
}
