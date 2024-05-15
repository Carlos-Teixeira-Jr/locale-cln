import { useRouter } from 'next/router';
import { useState } from 'react';
import Modal from 'react-modal';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CloseIcon from '../icons/closeIcon';
import Loading from '../loading';

interface IRedirectToUserDataModal {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}

const RedirectToUserDataModal = ({
  isOpen,
  setModalIsOpen
}: IRedirectToUserDataModal) => {

  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const isMobile = useIsMobile();

  return (
    <div>
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
        <div className='flex flex-col-reverse md:flex-row'>
          <h1 className="md:text-2xl text-red-500 font-bold mb-5">Você não tem dados de pagamento cadastrados para efetuar essa compra.</h1>
          <div className="w-[66px] h-[66px] rounded-full bg-red-500 shrink-0 flex justify-center items-center m-auto mb-5 md:ml-10">
            <CloseIcon fill="white" viewBox="-1 -1 48 48 my-auto" />
          </div>
        </div>

        <p className="font-normal md:text-xl leading-6 text-quaternary">Por favor, insira seus dados de cartão de crédito na página de dados do usuário e efetue a compra novamente</p>

        <div>
          <div className={'flex justify-between w-full mb-4 mt-8'}>
            <button
              className='active:bg-gray-500 cursor-pointer flex items-center flex-row justify-around bg-primary w-32 md:w-44 h-10 md:h-14 text-tertiary rounded transition-colors duration-300 font-bold md:text-lg hover:bg-red-600 hover:text-white'
              disabled={loading}
              onClick={() => push('/adminUserData?page=1')}
            >
              <span className={`${loading ? 'ml-5' : ''}`}>Inserir dados de pagamento</span>
              {loading && <Loading />}
            </button>

            <button
              className='active:bg-gray-500 cursor-pointer flex items-center flex-row justify-around bg-primary w-32 md:w-44 h-10 md:h-14 text-tertiary rounded transition-colors duration-300 font-bold text-lg hover:bg-red-600 hover:text-white'
              disabled={loading}
              onClick={() => setModalIsOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RedirectToUserDataModal