import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { IPlan } from "../../../common/interfaces/plans/plans";
import { IData } from "../../../common/interfaces/property/propertyData";
import { useIsMobile } from "../../../hooks/useIsMobile";
import MiniPropertyCards from "../../molecules/cards/miniCards/miniPropertyCards";

export interface ISelectAdsToDeactivateModal {
  isOpen: boolean,
  setModalIsOpen: (value: boolean) => void;
  docs: IData[],
  setConfirmAdsToDeactivate: (isConfirmed: boolean) => void,
  onSubmit: (confirmChange: boolean) => void,
  docsToDeactivate: (docs: string[]) => void,
  selectedPlan: IPlan | undefined
}

const SelectAdsToDeactivateModal = ({
  isOpen,
  setModalIsOpen,
  docs,
  setConfirmAdsToDeactivate,
  onSubmit,
  docsToDeactivate,
  selectedPlan
}: ISelectAdsToDeactivateModal) => {

  const isMobile = useIsMobile();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [unselectedCards, setUnselectedCards] = useState<string[]>([])
  const [credits, setCredits] = useState<number>(0);
  const [confirm, setConfirm] = useState(false)
  console.log("🚀 ~ confirm:", confirm)

  useEffect(() => {
    if (selectedPlan) {
      setCredits(selectedPlan?.commonAd - 1);
    }
  }, [selectedPlan]);

  useEffect(() => {
    // Update unselectedCards based on docs and selectedCards
    const newUnselectedCards = docs?.reduce<string[]>((acc, doc) => {
      if (!selectedCards.includes(doc._id)) {
        return [...acc, doc._id];
      }
      return acc;
    }, []);

    setUnselectedCards(newUnselectedCards);
  }, [docs, selectedCards]);

  useEffect(() => {
    docsToDeactivate(unselectedCards);
  }, [unselectedCards]);

  const handleSelectedCards = (card: string) => {
    if (selectedCards.includes(card)) {
      const filteredArray = selectedCards.filter((prevCard) => prevCard !== card);
      setSelectedCards(filteredArray);
      setCredits((prevState) => prevState + 1);
    } else if (credits > 0) {
      setSelectedCards((prevState) => [...prevState, card]);
      setCredits((prevState) => prevState - 1);
    }
  };

  const handleConfirmAdsToDeactivate = () => {
    setConfirm(true);
    setModalIsOpen(false);
    onSubmit(false);
  }

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ confirm:", confirm)

    if (confirm) setConfirmAdsToDeactivate(true);
  }, [confirm])

  return (
    <ReactModal
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
          padding: isMobile ? '10px' : '20px',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          maxHeight: '90%',
          width: isMobile ? '90%' : '70%',
          maxWidth: '1000px',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      }}
    >

      <div className="w-full text-quaternary text-xl text-center">
        <h1 className="text-primary font-bold">Selecione os imóveis que você deseja manter ativos em sua conta:</h1>
        <h2 className="text-base">créditos disponíveis: {credits}</h2>
      </div>

      <div className="flex gap-2 md:gap-3 lg:gap-4 flex-wrap justify-between md:justify-start">
        {docs?.length > 0 &&
          docs
            .filter((doc) => doc.isActive === true) // Filtrar apenas os documentos ativos
            .map((doc) => (
              <MiniPropertyCards
                key={doc?._id}
                _id={doc?._id}
                src={doc?.images[0]}
                streetName={doc?.address.streetName}
                neighborhood={doc?.address.neighborhood}
                city={doc?.address.uf}
                price={doc?.prices[0].value.toString()}
                isSelected={selectedCards.includes(doc._id)}
                setSelectedCard={(card: string) => handleSelectedCards(card)}
              />
            ))}
      </div>


      <div className="w-full flex gap-5 md:gap-0 md:flex-row flex-col-reverse mt-5 mx-auto md:justify-between">
        <button
          onClick={() => setModalIsOpen(false)}
          className={`flex items-center flex-row justify-around mx-auto w-full md:w-44 h-14 text-tertiary rounded-2xl  font-bold text-lg md:text-x bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer`}
        >
          Cancelar
        </button>
        <button
          className={`flex items-center flex-row justify-around mx-auto w-full md:w-44 h-14 text-tertiary rounded-2xl font-bold text-lg md:text-x bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer`}
          onClick={handleConfirmAdsToDeactivate}
        >
          Confirmar
        </button>
      </div>

    </ReactModal>
  )
}

export default SelectAdsToDeactivateModal