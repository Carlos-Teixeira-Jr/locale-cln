import React, { useEffect, useState } from 'react'
import ReactModal from 'react-modal';
import CloseIcon from '../icons/closeIcon';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
ReactModal.setAppElement('#__next');

interface IConfirmActivationModal {
  isOpen: boolean
  setModalIsOpen: (value: boolean) => void
  isActiveProp: boolean
  propertyIdProp: string
}

export default function confirmActivationModal({
  isOpen, 
  setModalIsOpen, 
  isActiveProp,
  propertyIdProp,
}: IConfirmActivationModal) {

  const [ isMobile, setIsMobile ] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(isActiveProp);
  const [propertyId, setPropertyId] = useState<string>(propertyIdProp);
  const { data: session } = useSession() as any;
  const userId = session?.user?.data._id;

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
      const response = await fetch('http://localhost:3001/property/property-activation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId,
          isActive: !isActive,
          userId
        })
      });

      if(response.ok) {
        toast.dismiss();
        setModalIsOpen(false);
        window.location.reload();
      } else {
        toast.dismiss();
        toast.warning("Houve um erro ao desativar o anuncio.")
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Não foi possível estabelecer comunicação com o servidor no momento. Por favor, tente novamente mais tarde.')
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
          zIndex: 99
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
        <div className='flex flex-col'>
          <div>
            <div className='w-fit float-right'>
              <CloseIcon
                onClick={() => setModalIsOpen(false)}
                fill='#6B7280'
                className='float-right cursor-pointer'
              />
            </div>
          </div>
            
          <Image 
            src={"/images/logo-marker.png"} 
            alt={"Locale imóveis logomarca"} 
            width={300}
            height={150}
            className='mx-auto'
          />
        </div>
        
        <h1 className="text-xl font-bold mb-4 text-primary">{`Você tem certeza que quer ${isActive ? 'inativar' : 'reativar'} este anúncio?`}</h1>
        <p className="font-bold text-xs text-quaternary mb-4">
          {isActive ? 
            'Caso queira reativar este anúncio no futuro será cobrado um crédito de anúncio de seu plano.' :
            'A reativação do anúncio custa um crédito. Tem certeza que deseja reativá-lo?'
          }
        </p>
        <button
          className="md:w-fit h-[50px] bg-primary p-2.5 rounded-[50px] font-normal text-xl text-tertiary leading-6 mx-auto mt-5 transition-colors duration-300 hover:bg-red-600 hover:text-white"
          onClick={handleIsActive}
        >
          Confirmar
        </button>
      </div>

    </ReactModal>
  )
}
