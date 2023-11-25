import { useEffect, useState } from 'react';
import LocationIcon from '../../../atoms/icons/location';
import PlusIcon from '../../../atoms/icons/plusIcon';
import LocaleLogo from '../../../atoms/logos/locale';
import ArrowDownIcon from '../../../atoms/icons/arrowDownIcon';

interface IPlansCardHidden {
  selectedPlanCard: string;
  setSelectedPlanCard: (plan: string) => void;
  isAdminPage?: boolean;
  name: string;
  price: number;
  commonAd: number;
  highlightAd: number;
  smartAd: boolean;
  id: string;
  isEdit:boolean;
  userPlan?: string
}

const PlansCardsHidden: React.FC<IPlansCardHidden> = ({
  selectedPlanCard,
  setSelectedPlanCard,
  isAdminPage,
  name,
  price,
  commonAd,
  highlightAd,
  smartAd,
  id,
  userPlan
}) => {
  
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  // Essa função identifica qual card foi clicado para lidar com as condicionais de estilo do dropdown;
  const handleDropdown = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  useEffect(() => {
    if (userPlan) setSelectedPlanCard(userPlan)
  }, [userPlan])

  return (
    <div
      className={`${
        isAdminPage
          ? 'md:flex lg:flex-row justify-center lg:mb-10 mx-10 md:mx-auto'
          : 'md:flex md:flex-row justify-center md:mb-5 px-5 md:px-0 md:mx-auto'
      }`}
    >
      <div
        className={`md:mx-auto my-5 lg:my-0 rounded-t-[35px] rounded-b-[30px] border-[5px] h-fit ${
          selectedPlanCard === id ? 'border-secondary' : 'border-none'
        }`}
      >
        <div
          className={`flex bg-primary rounded-t-[30px] ${
            isAdminPage
              ? 'md:w-[230px] md:h-[66px]'
              : 'md:w-60 md:h-fit py-2'
          }`}
        >
          <div className="flex items-center m-auto">
            <h2
              className={`${
                isAdminPage
                  ? 'font-bold text-[35px] text-tertiary mr-2'
                  : 'font-bold text-3xl md:text-2xl text-tertiary mr-3'
              }`}
            >
              Plano
            </h2>
            <h2
              className={`${
                isAdminPage
                  ? 'font-bold text-[35px] text-secondary'
                  : 'font-bold text-3xl md:text-2xl text-secondary'
              }`}
            >
              {name === 'Locale Plus' ? (
                <div className="">
                  <div className="bg-tertiary rounded-full flex h-[33px] lg:mt-2">
                    <LocaleLogo
                      className="mt-0.5"
                      width={`${isAdminPage ? '90' : '100'}`}
                    />
                    <PlusIcon
                      fill="#F5BF5D"
                      className="pb-[15px]"
                      width={`${isAdminPage ? '35' : '48'}`}
                    />
                  </div>
                </div>
              ) : (
                name
              )}
            </h2>
          </div>
        </div>
        {/* AQUI */}
        <div
          className={`bg-tertiary rounded-b-[30px] drop-shadow-lg ${
            isAdminPage
              ? `md:w-[230px] ${
                  selectedCards.includes(id) ? 'h-fit' : 'h-fit'
                }`
              : `md:w-60 ${
                  selectedCards.includes(id) ? 'h-fit' : 'h-fit'
                }`
          }`}
        >
          <div
            className={`${
              isAdminPage
                ? `${
                    selectedCards.includes(id)
                      ? 'h-fit'
                      : 'h-fit flex flex-col justify-center'
                  }`
                : `${selectedCards.includes(id) ? 'h-fit pb-5' : 'h-fit pb-5'}`
            }`}
          >
            <h1 className="text-4xl font-normal leading-[60px] py-3 text-center">
              {price === 0 ? 'GRÁTIS' : `R$ ${price},00`}
            </h1>
            <div className="flex w-full">
              <hr className="w-48 text-center md:mr-8 mr-[45px] md:ml-16 ml-[50px] text-quaternary border border-quaternary" />
              <div
                className="flex justify-center"
                onClick={() => {
                  handleDropdown(id);
                }}
              >
                <span onClick={() => handleDropdown(id)}>
                  <ArrowDownIcon
                    className={`float-right cursor-pointer transform transition-transform duration-300 ${
                      isAdminPage ? 'mr-5' : 'mr-5'
                    } ${selectedCards.includes(id) ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
            </div>
            <div
              className={`my-1 sm:mx-5 md:mx-0 ${
                isAdminPage
                  ? `${selectedCards.includes(id) ? '' : 'hidden'}`
                  : `${selectedCards.includes(id) ? '' : 'hidden'}`
              }`}
            >
              <p className="text-center my-2 text-lg font-medium text-quaternary mx-8">
                Com o plano {name.toUpperCase()} você tem direito a:
              </p>
              <div
                className={`${
                  isAdminPage ? 'flex mx-3 mb-5' : 'flex mx-10 mb-7'
                }`}
              >
                <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                  <LocationIcon fill="white" />
                </div>
                <p
                  className={`text-quaternary leading-7 ${
                    isAdminPage
                      ? 'font-medium text-[16px]'
                      : 'font-medium text-xl'
                  }`}
                >
                  {commonAd > 1
                    ? `${commonAd} Ofertas Comuns`
                    : `${commonAd} Oferta Comum`}
                </p>
              </div>

              {highlightAd > 0 && (
                <div
                  className={`${
                    isAdminPage ? 'flex mx-3 mb-5' : 'flex mx-10 mb-7'
                  }`}
                >
                  <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full shrink-0">
                    <LocationIcon fill="white" />
                  </div>
                  <p
                    className={`text-quaternary leading-7 ${
                      isAdminPage
                        ? 'font-medium text-[16px]'
                        : 'font-medium text-xl'
                    }`}
                  >
                    {highlightAd > 1
                      ? `${highlightAd} Ofertas Destaque`
                      : `${highlightAd} Oferta Destaque`}
                  </p>
                </div>
              )}

              <div className={`${isAdminPage ? 'flex mx-3' : 'flex mx-10'}`}>
                <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full shrink-0">
                  <LocationIcon fill="white" />
                </div>
                <p
                  className={`text-quaternary leading-7 ${
                    isAdminPage
                      ? 'font-medium text-[16px]'
                      : 'font-medium text-xl'
                  }`}
                >
                  Área de Gerenciamento
                </p>
              </div>

              {smartAd && (
                <div
                  className={`${
                    isAdminPage
                      ? 'flex mx-3 mb-5 '
                      : 'grid grid-flow-col mx-10 mb-7 mt-4'
                  }`}
                >
                  <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full shrink-0">
                    <LocationIcon fill="white" />
                  </div>
                  <p
                    className={`text-quaternary leading-7 ${
                      isAdminPage
                        ? 'font-medium text-[16px]'
                        : 'font-medium text-xl'
                    }`}
                  >
                    Criação de Anúncios Inteligentes.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div
            className={`${
              isAdminPage
                ? ` ${selectedCards.includes(id) ? 'flex' : 'flex'}`
                : `${selectedCards.includes(id) ? 'flex' : 'flex'}`
            }`}
          >
            <button
              className={`rounded-[10px] text-tertiary mx-auto my-5 font-semibold ${
                isAdminPage
                  ? `${
                      selectedPlanCard === id
                        ? `bg-secondary w-[180px] h-[44px] text-base ${
                          selectedCards.includes(id) ?
                          'mt-5' :
                          ''
                        }`
                        : 'bg-primary w-[180px] h-[44px] text-base'
                    }`
                  : `w-full h-[66px] mt-5 mx-5 text-2xl ${
                      selectedPlanCard === id
                        ? 'bg-secondary'
                        : 'bg-primary'
                    }`
              }`}
              onClick={() => {
                setSelectedPlanCard(selectedPlanCard !== id ? id : '');
              }}
            >
              {selectedPlanCard === id ? 'Meu Plano' : 'Assinar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansCardsHidden;
