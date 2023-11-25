import Image from 'next/image';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import CloseIcon from '../icons/closeIcon';
Modal.setAppElement('#__next');

export interface IUnverifiedEmailModal {
  isOpen: boolean;
  setModalIsOpen: (value: boolean) => void;
  isMobile: boolean;
  email: string;
}

export default function unverifiedEmailModal({
  isOpen,
  setModalIsOpen,
  isMobile,
  email,
}: IUnverifiedEmailModal) {
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="unverified email waning modal"
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
            src={'/images/logo-marker.png'}
            alt={'Locale imóveis logomarca'}
            width={300}
            height={150}
            className="mx-auto"
          />
        </div>

        <h1 className="text-xl font-bold mb-4 text-primary">
          Email não verificado
        </h1>
        <p className="font-bold text-xs text-quaternary mb-4">
          O email que você tentou usar já está vinculado a uma conta, mas ainda
          não foi verificado.
        </p>
        <p className="font-bold text-xs text-quaternary">
          Você será redirecionado para a tela de login para completar o processo
          de verificação de email.
        </p>
        <button
          className="md:w-fit h-[50px] bg-primary p-2.5 rounded-[50px] font-normal text-xl text-tertiary leading-6 mx-auto mt-5 transition-colors duration-300 hover:bg-red-600 hover:text-white"
          onClick={() => {
            router.push({
              pathname: '/login',
              query: { email: email },
            });
          }}
        >
          Verificar e-mail
        </button>
      </div>
    </Modal>
  );
}
