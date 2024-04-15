
import React, { useState } from 'react';
import Modal from 'react-modal';
import CheckIcon from '../icons/checkIcon';
Modal.setAppElement('#__next');

export interface IChangePlanModal {
  isOpen: boolean;
  setModalIsOpen: (value: boolean) => void;
  message: string;
  onConfirm: () => void
}

const ChangePlanModal: React.FC<IChangePlanModal> = ({
  isOpen,
  setModalIsOpen,
  message,
  onConfirm
}) => {

  const [infoMessage, setInfoMessage] = useState(message);
  const [loading, setIsLoading] = useState(false);

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setInfoMessage('')
  };

  const handleSubmit = () => {
    onConfirm();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="payment fail modal"
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          border: '1px solid #ccc',
          background: 'rgba(255, 255, 255)',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '',
          borderColor: 'red',
          borderWidth: '5px',
          outline: 'none',
          padding: '20px',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          width: 'auto',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <div className="p-10 flex">
        <div className='my-auto'>
          <h1 className="text-3xl text-green-500 font-bold mb-5">
            Você está trocando seu plano
          </h1>
          <p className="font-bold text-xl leading-6 text-quaternary ">
            {infoMessage}
          </p>
        </div>
        <div className="w-[66px] h-[66px] rounded-full bg-green-500 shrink-0 flex justify-center my-auto ml-10">
          <CheckIcon fill="white" className='my-auto' />
        </div>
      </div>
      <div className='flex justify-between w-full'>
        <button
          className={`flex items-center flex-row justify-around w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl ${loading ?
            'bg-red-300 transition-colors duration-300' :
            'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
            }`}
          onClick={handleSubmit}
        >
          Confirmar
        </button>
        <button
          className={`flex items-center flex-row justify-around w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl ${loading ?
            'bg-red-300 transition-colors duration-300' :
            'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
            }`}
          onClick={handleCloseModal}
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default ChangePlanModal;
