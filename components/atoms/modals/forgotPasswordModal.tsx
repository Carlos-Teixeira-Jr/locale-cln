import Image from 'next/image';
import React, { MouseEvent, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from '../../../common/utils/toasts';
import { sendRequest } from '../../../hooks/sendRequest';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CloseIcon from '../icons/closeIcon';
import Loading from '../loading';
Modal.setAppElement('#__next');

export interface IForgotPasswordModal {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}

const ForgotPasswordModal: React.FC<IForgotPasswordModal> = ({
  isOpen,
  setModalIsOpen,
}) => {
  const [emailForChangePassword, setEmailForChangePassword] =
    useState<string>('');
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false)

  const handleOnChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const emailForChangePassword = event.target.value;
    setEmailForChangePassword(emailForChangePassword);
  };

  const handleCloseModal = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    setModalIsOpen(false);
  };

  const handleOnSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const data = await sendRequest(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/request-password`,
        'POST',
        { email: emailForChangePassword }
      );

      if (data) {
        setEmailForChangePassword('');
        setTimeout(() => setModalIsOpen(false), 3000);
        toast.dismiss();
        showSuccessToast(SuccessToastNames.PasswordRecovery);
      } else if (data.status === 404) {
        const errorData = await data.json();
        const errorMessage = errorData.message;
        toast.error(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(ErrorToastNames.ServerConnection);
      setLoading(false)
    }
  };

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
              onClick={handleCloseModal}
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
          Informe o e-mail para enviarmos um link de redefinição de senha.
        </p>

        <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-full mt-auto mb-1">
          E-mail
        </label>
        <input
          className="w-full h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary p-2 md:text-xl font-semibold"
          type="text"
          value={emailForChangePassword}
          onChange={handleOnChangeEmail}
          maxLength={50}
        />

        <button
          className={`w-full md:w-fit h-[50px] flex justify-center gap-2 p-2.5 rounded-[50px] font-normal text-xl transition-colors duration-300 text-tertiary mx-auto mt-5 ${loading ? 'bg-red-300' : 'bg-primary hover:bg-red-600 hover:text-white'}`}
          onClick={handleOnSubmit}
          disabled={loading}
        >
          <span className={`${loading ? 'ml-5' : ''}`}>Redefinir senha</span>
          {loading && <Loading />}
        </button>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;
