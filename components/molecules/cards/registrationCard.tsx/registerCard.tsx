import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import UnverifiedEmailModal from '../../../atoms/modals/unverifiedEmailModal';

const RegisterCard: React.FC = () => {

  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [unverifiedEmailModal, setUnverifiedEmailModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if(email !== ''){
      setEmailError('')
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
  };

  const handleContinueBtn = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if(!email){
      setEmailError('Por favor, insira seu email para cadastrar um anúncio');
    } else {
      try {
        toast.loading('Enviando...');
        const response = await fetch('http://localhost:3001/user/find-by-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email
          })
        });

        const data = await response.json();
        console.log("🚀 ~ file: registerCard.tsx:64 ~ handleContinueBtn ~ response.ok:", response.ok)

        if (response.ok) {
          const isEmailVerified = data.isEmailVerified;
          console.log("🚀 ~ file: registerCard.tsx:69 ~ handleContinueBtn ~ isEmailVerified:", isEmailVerified)
          if (!isEmailVerified) {
            toast.dismiss();
            setUnverifiedEmailModal(true)
          } else {
            toast.dismiss();
            router.push({
              pathname: '/register',
              query: email
            });
          }
        } else {
          toast.dismiss();
          router.push({
            pathname: '/register',
            query: email
          });
        }
      } catch (error) {
        console.log(error)
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
          className={`lg:w-[360px] md:w-full w-[291px] h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary md:p-2 text-xl font-semibold ${
            emailError === '' ?
            '' :
            'border-[2px] border-red-500'
          }`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailValidation}
        />

        {emailError !== '' && (
          <span className='text-sm text-red-500'>{emailError}</span>
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
          <button 
            className="bg-quinary md:w-fit h-fit rounded-[30px] border-[1px] border-quaternary flex justify-center items-center mx-2 transition-colors duration-300 hover:bg-gray-200 hover:border-gray-500 p-2 gap-2"
            onClick={() => {
              signIn('google', {
                callbackUrl: '/register'
              });
              toast.loading('Enviando...')
            }}
          >
            <div className="md:pl-0">
              <Image
                src={'/images/google-icon.png'}
                alt={''}
                width={32}
                height={32}
              />
            </div>
            <div>
              <p className="font-bold text-quaternary text-sm transition-colors duration-300 hover:text-gray-500">
                Continuar com o Google
              </p>
            </div>
          </button>
        </div>
        <div>
          <button 
            className="bg-quinary md:w-fit h-fit rounded-[30px] border-[1px] border-quaternary flex justify-center items-center mx-2 transition-colors duration-300 hover:bg-gray-200 hover:border-gray-500 p-2 gap-2"
            onClick={() => {
              signIn('facebook', {
                callbackUrl: '/register'
              });
              toast.loading('Enviando...')
            }}
          >
            <div className="md:pl-0">
              <Image
                src={'/images/fb-icon.png'}
                alt={''}
                width={32}
                height={32}
              />
            </div>
            <div>
              <p className="font-bold text-quaternary text-sm transition-colors duration-300 hover:text-gray-500">
                Continuar com o Facebook
              </p>
            </div>
          </button>
        </div>
      </div>
      <a
        className="font-bold text-xs md:max-w-[300px] lg:max-w-fit text-center text-quaternary mx-5 my-5 md:my-5 md:mx-5 relative inline-block group transition-colors duration-300 hover:text-secondary"
        href="/termos-de-uso"
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
