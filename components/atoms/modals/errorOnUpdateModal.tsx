import React from 'react';
import Modal from 'react-modal';
import CloseIcon from '../icons/closeIcon';
Modal.setAppElement('#__next');

export interface IErrorOnUpdateModal {
  errorModalIsOpen: boolean;
  setErrorModalIsOpen: (isOpen: boolean) => void;
}

const ErrorOnUpdateModal: React.FC<IErrorOnUpdateModal> = ({
  errorModalIsOpen,
  setErrorModalIsOpen,
}) => {
  const handleCloseModal = () => {
    setErrorModalIsOpen(false);
  };

  return (
    <Modal
      isOpen={errorModalIsOpen}
      onRequestClose={() => setErrorModalIsOpen(false)}
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
          borderRadius: '30px',
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
      <div className="flex flex-col justify-center rounded-[30px] p-12">
        <div className="flex justify-center">
          <h1 className="text-5xl text-quaternary font-bold leading-[56px] mb-5">
            Houve um erro ao atualizar os dados
          </h1>
          <div className="w-[66px] h-[66px] rounded-full bg-red-500 shrink-0 flex justify-center my-auto mx-2">
            <CloseIcon fill="white" viewBox="-1 -9 48 48" />
          </div>
        </div>
        <label className="text-lg leading-5 font-medium text-quaternary mb-9">
          Tente mais tarde ou contate o suporte
        </label>
        <button
          className="bg-primary rounded-[10px] py-8 w-fit px-40 mx-auto text-tertiary text-xl font-extrabold"
          onClick={handleCloseModal}
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default ErrorOnUpdateModal;
