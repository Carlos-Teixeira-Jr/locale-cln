import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import CloseIcon from '../icons/closeIcon';
import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from '../../../common/utils/toasts';

export interface IVerifyEmailModal {
  isOpen: boolean;
  setModalIsOpen: any;
  emailVerificationDataProp: any;
}

const VerifyEmailModal: React.FC<IVerifyEmailModal> = ({
  isOpen,
  setModalIsOpen,
  emailVerificationDataProp,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [showResendMessage, setShowResendMessage] = useState(true);
  const [emailVerificationData, setEmailVerificationData] = useState({
    email: null,
    emailVerificationCode: '',
    password: null,
  });

  useEffect(() => {
    setEmailVerificationData(emailVerificationDataProp);
  }, [emailVerificationDataProp]);

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

  const handleSubmit = async (e: any) => {
    try {
      toast.loading('Enviando');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailVerificationData.email,
            emailVerificationCode: emailVerificationData.emailVerificationCode,
          }),
        }
      );

      if (response.ok) {
        try {
          signIn('credentials', {
            email: emailVerificationData.email,
            password: emailVerificationData.password,
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        setVerificationCodeError(
          'Insira corretamente o código de validação enviado para o e-mail de cadastro.'
        );
        toast.dismiss();
        showErrorToast(ErrorToastNames.VerificationCode)
      }
    } catch (error) {
      toast.dismiss();
      showErrorToast(ErrorToastNames.ServerConnection);
      console.log(
        `Erro ao validar o código de verificação de e-mail: ${error}`
      );
    }
  };

  const handleResendVerifyEmailCode = async (e: any) => {
    e.preventDefault();
    try {
      toast.loading('Enviando...');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/re-send-email-verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailVerificationData.email,
          }),
        }
      );

      if (response.ok) {
        setShowResendMessage(false); // Hide the message after clicking
        setTimeout(() => {
          setShowResendMessage(true); // Show the message after 60 seconds
        }, 60000); // 60 seconds in milliseconds
        toast.dismiss();
        showSuccessToast(SuccessToastNames.VerificationCode);
        const data = await response.json();

        const newEmailVerificationCode = data.emailVerificationCode;
        const newEmailVerificationExpiry = data.emailVerificationExpiry;

        setEmailVerificationData({
          ...emailVerificationData,
          emailVerificationCode: newEmailVerificationCode,
        });
      }
    } catch (error) {
      showErrorToast(ErrorToastNames.ServerConnection);
      console.error(error);
    }
  };

  return (
    <Modal
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
      <div>
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
            Insira o código de verificação enviado para o e-mail usado no
            cadastro.
          </p>

          <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-full mt-auto mb-1">
            Código de verificação
          </label>
          <input
            className={`w-full h-fit md:h-12 rounded-[10px] border-[1px]  drop-shadow-xl bg-tertiary text-quaternary md:p-2 text-xl font-semibold ${
              verificationCodeError ? 'border-red-500' : 'border-quaternary'
            }`}
            type="text"
            value={input}
            onChange={(e) => {
              setEmailVerificationData({
                ...emailVerificationData,
                emailVerificationCode: e.target.value,
              });
              setInput(e.target.value);
            }}
            maxLength={10}
          />

          {verificationCodeError && (
            <span className="text-red-500 text-sm">
              {verificationCodeError}
            </span>
          )}

          <button
            className="md:w-fit h-[50px] bg-primary p-2.5 rounded-[50px] font-normal text-xl text-tertiary leading-6 mx-auto mt-5 transition-colors duration-300 hover:bg-red-600 hover:text-white"
            onClick={handleSubmit}
          >
            Confirmar
          </button>
        </div>

        {showResendMessage && (
          <p
            className="font-bold text-xs text-quaternary mx-5 my-5 md:my-0 md:mb-4 md:mx-auto pt-2 relative inline-block group transition-colors duration-300 hover:text-secondary cursor-pointer w-full text-center"
            onClick={handleResendVerifyEmailCode}
          >
            Reenviar código de verificação de email.
          </p>
        )}

        {!showResendMessage && (
          <span className="text-xs text-primary leading-3">
            Aguarde 60 segundos antes de reenviar um novo código de verificação
            de email.
          </span>
        )}
      </div>
    </Modal>
  );
};

export default VerifyEmailModal;
