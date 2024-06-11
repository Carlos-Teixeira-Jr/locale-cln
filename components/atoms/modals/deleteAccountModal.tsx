import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { useState } from "react";
import Modal from 'react-modal';
import { toast } from "react-toastify";
import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from "../../../common/utils/toasts";
import { useIsMobile } from "../../../hooks/useIsMobile";
import CloseIcon from "../icons/closeIcon";
import Loading from "../loading";
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
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
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
        await signOut();
        router.push('/login');
      } else {
        toast.dismiss();
        setLoading(false);
        showErrorToast(ErrorToastNames.DeleteUser)
      }
    } catch (error) {
      toast.dismiss();
      setLoading(false);
      console.error(error)
      showErrorToast(ErrorToastNames.ServerConnection)
    }
  }

  const buttons = [
    {
      key: 'cancel',
      label: 'Cancelar',
      onClick: () => setModalIsOpen(false)
    },
    {
      key: 'confirm',
      label: 'Confirmar',
      onClick: handleDeleteAccount
    },
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
          src={'/images/Logo_Locale_HD.png'}
          alt={'Locale imóveis logomarca'}
          width={300}
          height={150}
          className="mx-auto"
        />

        <p className="font-bold text-sm text-quaternary">
          Só para avisar: ao excluir sua conta, você não terá mais acesso aos seus anúncios e favoritos. 🙃 Tem certeza de que quer continuar?
        </p>

        <div className="flex justify-between">
          {buttons.map((btn) => (
            <button
              key={btn.key}
              className={`flex items-center flex-row justify-around w-28 h-10 md:w-44 md:h-14 text-tertiary rounded-full mt-5 font-bold text-lg md:text-xl ${loading
                ? 'bg-red-300 transition-colors duration-300'
                : 'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
                }`}
              onClick={btn.onClick}
            >
              {loading && btn.key === 'confirm' ? (
                <Loading />
              ) : (
                <span className={`${loading && btn.key === 'confirm' ? 'ml-5' : ''}`}>{btn.label}</span>
              )}
            </button>
          ))}
        </div>


      </div>
    </Modal>
  )
}

export default DeleteAccountModal