import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ErrorToastNames, InfoToastNames, showErrorToast, showInfoToast } from '../../../../common/utils/toasts';
import Loading from '../../../atoms/loading';
import UnverifiedEmailModal from '../../../atoms/modals/unverifiedEmailModal';
import SocialAuthButton from '../../buttons/socialAuthButtons';

const RegisterCard: React.FC = () => {
  const { data } = useSession() as any;
  const userEmail = data?.user?.data?.email! ? data?.user?.data?.email : data?.user?.email;
  const router = useRouter();
  const [email, setEmail] = useState<string>(userEmail! ? userEmail : '');
  const [emailError, setEmailError] = useState<string>('');
  const [unverifiedEmailModal, setUnverifiedEmailModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
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
            router.push({
              pathname: '/register',
              query: {
                email
              }
            });
            toast.dismiss();
          }
        } else {
          router.push({
            pathname: '/register',
            query: {
              email,
            },
          });
          toast.dismiss();
        }
      } catch (error) {
        setLoading(false);
        showErrorToast(ErrorToastNames.UserNotFound)
      }
    }
  };

  return (
    <div className="md:w-fit md:h-fit md:rounded-[30px] pt-2 bg-tertiary drop-shadow-xl grid grid-flow-rows justify-items-center">
      <div className="md:mt-2">
        <Image
          src={'/images/Logo_Locale_HD.png'}
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
          className={`lg:w-[360px] md:w-full w-[291px] h-10 md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary px-2 md:p-2 text-xl font-semibold ${emailError === '' ? '' : 'border-[2px] border-red-500'
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
      <button
        className={`flex items-center flex-row justify-around w-2/3 lg:w-56 h-14 text-tertiary rounded-full m-5 font-bold text-lg md:text-xl ${loading ?
          'bg-red-300 transition-colors duration-300' :
          'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
          }`}
        onClick={handleContinueBtn}
      >
        <span className={`${loading ? 'ml-5' : ''}`}>Continuar</span>
        {loading && <Loading />}
      </button>
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
