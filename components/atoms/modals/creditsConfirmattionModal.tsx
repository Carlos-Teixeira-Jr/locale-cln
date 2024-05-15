import Modal from 'react-modal';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { Credits } from '../../organisms/creditsShop/creditsShopBoard';

interface ICreditsConfirmattionModal {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  credits: Credits,
  ownerAdCredits: number,
  ownerHighlightCredits: number,
  onConfirm: () => void,
  totalPrice: number,
  ownerPlanPrice: number
}

const CreditsConfirmationModal = ({
  isOpen,
  setModalIsOpen,
  credits,
  ownerAdCredits,
  ownerHighlightCredits = 0,
  onConfirm,
  totalPrice,
  ownerPlanPrice
}: ICreditsConfirmattionModal) => {

  const isMobile = useIsMobile()
  const adCreditsDifference = credits.adCredits - ownerAdCredits;
  const highlightCreditsDifference = credits.highlightCredits - ownerHighlightCredits;

  return (
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
      <main className='md:p-5 text-xl font-semibold text-quaternary flex flex-col gap-5'>
        <h1 className='w-full md:text-2xl font-bold text-quaternary'>Confirmação de compra de créditos</h1>
        <p>Você está comprando:</p>

        <div className='flex flex-col border border-primary text-center gap-2 py-2'>
          {credits.adCredits > ownerAdCredits && (
            <p className='font-semibold text-xl'>{adCreditsDifference}  {`${adCreditsDifference > 1 ? 'x créditos' : 'x crédito'}`} de anúncio.</p>
          )}

          {credits.highlightCredits > ownerHighlightCredits && (
            <p className='font-semibold text-xl'>{highlightCreditsDifference}  {`${highlightCreditsDifference > 1 ? 'x créditos' : 'x crédito'}`} de destaque.</p>
          )}
        </div>
        <div className='flex flex-col'>

          <div className='flex gap-2 justify-between'>
            <p className='font-normal text-base max-w-[75%]'>• Valor do plano Locale Plus:</p>
            <span className='text-lg font-semibold my-auto'>{` R$ 50,00`}</span>
          </div>

          <div className='flex gap-2 justify-between'>
            <p className='font-normal text-base max-w-[75%]'>• Valor da compra atual de créditos:</p>
            <span className='text-lg font-semibold my-auto'>{` R$ ${totalPrice},00`}</span>
          </div>

          <div className='flex gap-2 justify-between'>
            <p className='font-normal text-base max-w-[70%]'>• Plano + créditos anteriores + compra atual:</p>
            <span className='my-auto'>{`R$ ${ownerPlanPrice + totalPrice},00`}</span>
          </div>
        </div>

        <div>
          <p className='text-base'>Ao confirmar o valor da compra, ele será acrescentado ao valor do seu plano em todas as próximas faturas. Isso significa que você verá esse valor adicional refletido em seus próximos pagamentos, facilitando o acompanhamento dos seus gastos e do custo total do serviço ao longo do tempo.</p>
        </div>

        <div className='w-full flex gap-10 justify-between text-tertiary mt-8'>
          <button
            className={`flex items-center flex-row justify-around w-full md:w-44 md:h-14 h-10 text-tertiary rounded font-bold text-lg md:text-xl bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer`}
            onClick={() => setModalIsOpen(false)}
          >
            Cancelar
          </button>

          <button
            className={`flex items-center flex-row justify-around w-full md:w-44 md:h-14 h-10 text-tertiary rounded font-bold text-lg md:text-xl bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer`}
            onClick={() => {
              onConfirm()
            }}
          >
            Confirmar
          </button>
        </div>

      </main>
    </Modal>
  )
}

export default CreditsConfirmationModal