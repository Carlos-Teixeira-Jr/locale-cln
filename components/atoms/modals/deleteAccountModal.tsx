import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from "next/router";
import Modal from 'react-modal';
import { toast } from "react-toastify";
import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from "../../../common/utils/toasts";
import { useIsMobile } from "../../../hooks/useIsMobile";
import CloseIcon from "../icons/closeIcon";
Modal.setAppElement('#__next');

export interface IDeleteAccountModal {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}

const DeleteAccountModal = ({
  isOpen,
  setModalIsOpen
}: IDeleteAccountModal) => {

  const isMobile = useIsMobile();
  const { data: session } = useSession() as any;
  const userId = session?.user?.data?._id;
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      toast.loading('Enviando');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      })

      if (response.ok) {
        toast.dismiss();
        showSuccessToast(SuccessToastNames.DeleteUser);
        signOut();
        router.push('/login');
      } else {
        toast.dismiss();
        showErrorToast(ErrorToastNames.DeleteUser)
      }
    } catch (error) {
      toast.dismiss();
      console.error(error)
      showErrorToast(ErrorToastNames.ServerConnection)
    }
  }

  const buttons = [
    {
      key: 'confirm',
      label: 'Confirmar',
      onClick: handleDeleteAccount
    },
    {
      key: 'cancel',
      label: 'Cancelar',
      onClick: () => setModalIsOpen(false)
    }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Message modal"
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
      <div className="bg-tertiary rounded-[30px] flex flex-col justify-center m-2 gap-2">
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

        <p className="font-bold text-xs text-quaternary">
          Ao excluir sua conta você não poderá mais acessar seus anúncios e favoritos do site. Tem certeza que deseja prosseguir?
        </p>

        <div className="flex justify-between">
          {buttons.map((btn) => (
            <button
              key={btn.key}
              className="md:w-40 h-[50px] bg-primary p-2.5 rounded-[50px] font-normal text-xl text-tertiary leading-6 mx-auto mt-5 transition-colors duration-300 hover:bg-red-600 hover:text-white"
              onClick={btn.onClick}
            >
              {btn.label}
            </button>
          ))}
        </div>

      </div>
    </Modal>
  )
}

export default DeleteAccountModal