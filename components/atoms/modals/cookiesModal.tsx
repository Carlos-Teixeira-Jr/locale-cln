import Modal from 'react-modal';

Modal.setAppElement('#__next');

export interface ICookiesModal {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
}

const CookiesModal: React.FC<ICookiesModal> = ({
  isOpen,
  setModalIsOpen,
  onClose,
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Calculator modal"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
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
          background: '#F7F7F6',
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
      <div className={classes.content}>
        <div className="flex flex-col">
          <h1 className={classes.title}>Aviso de cookies</h1>
          <hr className="mb-2" />
          <h1 className="text-justify">
            Com o seu consentimento, nós usamos cookies ou tecnologias
            semelhantes para armazenar e processar dados pessoais como a sua
            visita a esta página web, endereços IP e identificadores de cookies.
            Para saber mais, veja nossas políticas de uso.
          </h1>
        </div>
        <div className={classes.buttonContainer}>
          <a className={classes.anchorButton} href="/userTerms" target="_blank">
            Política de Privacidade e Termos de Uso
          </a>
          <button className={classes.buttonOk} onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CookiesModal;

const classes = {
  content: 'bg-tertiary flex flex-col justify-between items-center px-2 gap-1',
  title: 'text-quaternary text-center font-semibold text-xl mb-1',
  buttonContainer:
    'flex flex-row items-center justify-between px-2 mt-2 gap-2 w-full',
  anchorButton:
    'bg-transparent text-quaternary text-sm underline cursor-pointer',
  buttonOk: 'w-20 h-8 rounded bg-primary text-tertiary cursor-pointer px-1',
};
