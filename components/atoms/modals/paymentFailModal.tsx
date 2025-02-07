import React from 'react';
import Modal from 'react-modal';
import CloseIcon from '../icons/closeIcon';
Modal.setAppElement('#__next');

export interface IPaymentFailModal {
  isOpen: boolean;
  setModalIsOpen: (value: boolean) => void;
  paymentError: string
}

const PaymentFailModal: React.FC<IPaymentFailModal> = ({
  isOpen,
  setModalIsOpen,
  paymentError
}) => {

  const errorMessage = paymentError;

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

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
        <div>
          <h1 className="text-3xl text-red-500 font-bold mb-5">
            Falha no Pagamento
          </h1>
          <p className="font-bold text-xl leading-6 text-quaternary">
            Houve um problema com o pagamento, por favor tente novamente mais tarde.
          </p>
        </div>
        <div className="w-[66px] h-[66px] rounded-full bg-red-500 shrink-0 flex justify-center my-auto ml-10">
          <button onClick={handleCloseModal}>
            <CloseIcon fill="white" viewBox="-1 -1 48 48" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentFailModal;
