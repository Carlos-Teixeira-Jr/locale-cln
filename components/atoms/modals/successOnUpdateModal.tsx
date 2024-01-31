import Link from 'next/link';
import React from 'react';
import Modal from 'react-modal';
import CloseIcon from '../icons/closeIcon';
Modal.setAppElement('#__next');

export interface ISuccessOnUpdateModal {
  successModalIsOpen: boolean;
  setSuccessModalIsOpen: any;
}

const SuccessOnUpdateModal: React.FC<ISuccessOnUpdateModal> = ({
  successModalIsOpen,
  setSuccessModalIsOpen,
}) => {
  const handleCloseModal = () => {
    setSuccessModalIsOpen(false);
  };

  return (
    <Modal
      isOpen={successModalIsOpen}
      onRequestClose={() => setSuccessModalIsOpen(false)}
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
            Dados atualizados com sucesso
          </h1>
          <div className="w-[66px] h-[66px] rounded-full bg-green-500 shrink-0 flex justify-center my-auto mx-10">
            <CloseIcon fill="white" viewBox="-1 -9 48 48" />
          </div>
        </div>
        <Link href={'/admin?page=1'}>
          <button className="bg-primary rounded-[10px] py-8 w-fit px-40 mx-auto text-tertiary text-xl font-extrabold">
            OK
          </button>
        </Link>
      </div>
    </Modal>
  );
};

export default SuccessOnUpdateModal;
