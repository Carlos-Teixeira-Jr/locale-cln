import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { InfoToastNames, showInfoToast } from '../../../../common/utils/toasts';
import UnverifiedEmailModal from '../../../atoms/modals/unverifiedEmailModal';
import SocialAuthButton from '../../buttons/socialAuthButtons';

const RegisterCard: React.FC = () => {
  const { data } = useSession() as any;
  const { data: userData } = data.user;
  const router = useRouter();
  const [email, setEmail] = useState<string>(userData?.email ? userData?.email : '');
  const [emailError, setEmailError] = useState<string>('');
  const [unverifiedEmailModal, setUnverifiedEmailModal] =
    useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (email !== '') {
      setEmailError('');
    }
  }, [email]);

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

  function handleEmailValidation() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid && email !== '') {
      setEmailError('O e-mail inserido não tem o formato de um e-mail válido.');
    } else {
      setEmailError('');
    }
  }

  const handleContinueBtn = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!email) {
      setEmailError('Por favor, insira seu email para cadastrar um anúncio');
      showInfoToast(InfoToastNames.AnnouncementInfo);
    } else {
      try {
        toast.loading('Enviando...');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/user/find-by-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const isEmailVerified = data.isEmailVerified;
          if (!isEmailVerified) {
            toast.dismiss();
            setUnverifiedEmailModal(true);
          } else {
            toast.dismiss();
            router.push({
              pathname: '/register',
              query: {
                email
              }
            });
          }
        } else {
          toast.dismiss();
          router.push({
            pathname: '/register',
            query: {
              email,
            },
          });
        }
      } catch (error) {
        console.log('Nenhum usuário cadastrado com o e-mail informado.');
      }
    }
  };

  return (
    <div className="md:w-fit md:h-fit md:rounded-[30px] bg-tertiary drop-shadow-xl grid grid-flow-rows justify-items-center">
      <div className="md:mt-2">
        <Image
          src={'/images/logo-marker.png'}
          alt={'Locale imóveis logomarca'}
          width={200}
          height={90}
        />
      </div>
      <div className="grid justify-center">
        <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-fit mt-auto mb-1">
          E-mail
        </label>
        <input
          className={`lg:w-[360px] md:w-full w-[291px] h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary md:p-2 text-xl font-semibold ${emailError === '' ? '' : 'border-[2px] border-red-500'
            }`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailValidation}
          maxLength={50}
        />

        {emailError !== '' && (
          <span className="text-sm text-red-500">{emailError}</span>
        )}
      </div>
      <div>
        <button
          className="md:w-fit lg:w-[220px] w-[100px] md:h-[50px] bg-primary p-2.5 gap-2.5 rounded-[50px] font-normal md:text-xl text-lg text-tertiary leading-6 m-5 md:m-9 transition-colors duration-300 hover:bg-red-600 hover:text-white"
          onClick={handleContinueBtn}
        >
          Anunciar
        </button>
      </div>
      <div className="flex">
        <div>
          <SocialAuthButton
            provider="google"
            onClick={() => {
              toast.loading('Enviando...');
              signIn('google', { callbackUrl: '/register' });
            }}
          />
        </div>
        {/* <div>
          <SocialAuthButton
            provider='facebook'
            onClick={() => {
              toast.loading('Enviando...');
              signIn('facebook', {callbackUrl: '/register'});
            }}
          />
        </div> */}
      </div>
      <a
        className="font-bold text-xs md:max-w-[300px] lg:max-w-fit text-center text-quaternary mx-5 my-5 md:my-5 md:mx-5 relative inline-block group transition-colors duration-300 hover:text-secondary"
        href="/userTerms"
        target="_blank"
        rel="noreferrer"
      >
        Ao entrar aceito os Termos de Uso da Locale Imóveis e afirmo ter 18 anos
        ou mais.
        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-secondary transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
      </a>
      {unverifiedEmailModal && (
        <UnverifiedEmailModal
          isOpen={unverifiedEmailModal}
          setModalIsOpen={setUnverifiedEmailModal}
          isMobile={isMobile}
          email={email}
        />
      )}
    </div>
  );
};

export default RegisterCard;
