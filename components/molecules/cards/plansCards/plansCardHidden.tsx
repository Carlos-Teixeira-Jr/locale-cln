import { useState } from 'react';
import LocationIcon from '../../../atoms/icons/location';
import PlusIcon from '../../../atoms/icons/plusIcon';
import LocaleLogo from '../../../atoms/logos/locale';

interface IPlansCardHidden {
  selectedPlanCard: string;
  setSelectedPlanCard: any;
  isAdminPage?: boolean;
  name: string;
  price: number;
  commonAd: number;
  highlightAd: number;
  smartAd: number;
  id: any;
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
}) => {
  const [dropDownIsVisible, setDropdownIsVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [iddd, setIddd] = useState('');

  // Essa função identifica qual card foi clicado para lidar com as condicionais de estilo do dropdown;
  // BUG: A borda amarela do card selecionado é afetada pelo estado do dropdown dos outros cards não selecionados;
  const handleDropdown = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((name) => name !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  return (
    <div
      className={`${
        isAdminPage
          ? 'md:flex lg:flex-row justify-center mb-10 mx-10 md:mx-auto'
          : 'md:flex md:flex-col lg:flex-row justify-center mb-10 mx-10 md:mx-auto'
      }`}
    >
      <div
        className={`md:mx-auto my-5 lg:my-0 rounded-t-[35px] rounded-b-[30px] border-[5px] md:z-20 h-fit ${
          selectedPlanCard === name ? 'border-secondary' : 'border-none'
        }`}
      >
        <div
          className={`flex bg-primary rounded-t-[30px] ${
            isAdminPage
              ? 'md:w-[250px] md:h-[66px]'
              : 'md:w-[397px] md:h-[99px]'
          }`}
        >
          <div className="flex items-center m-auto">
            <h2
              className={`${
                isAdminPage
                  ? 'font-bold text-[35px] text-tertiary mr-2'
                  : 'font-bold text-[40px] text-tertiary mr-3'
              }`}
            >
              Plano
            </h2>
            <h2
              className={`${
                isAdminPage
                  ? 'font-bold text-[35px] text-secondary'
                  : 'font-bold text-[40px] text-secondary'
              }`}
            >
              {name === 'Locale Plus' ? (
                <div className="">
                  <div className="bg-tertiary rounded-full flex h-[39px] lg:mt-2">
                    <LocaleLogo
                      className="mt-0.5"
                      width={`${isAdminPage ? '90' : '136'}`}
                    />
                    <PlusIcon
                      fill="#F5BF5D"
                      className="pb-[7px]"
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
              ? `md:w-[250px] ${
                  selectedCards.includes(id) ? 'h-[546px]' : 'h-[202px]'
                }`
              : `md:w-[397px] ${
                  selectedCards.includes(id) ? 'h-[610px]' : 'h-[303px]'
                }`
          }`}
        >
          <div
            className={`${
              isAdminPage
                ? `${
                    selectedCards.includes(name)
                      ? 'h-[332px]'
                      : 'h-[120px] flex flex-col justify-center'
                  }`
                : `${selectedCards.includes(id) ? 'h-[500px]' : 'h-[180px]'}`
            }`}
          >
            <h1 className="text-5xl font-normal leading-[60px] py-6 text-center">
              {price === 0 ? 'GRÁTIS' : `R$ ${price},00`}
            </h1>
            <div className="flex w-full">
              <hr className="w-[200px] text-center md:mr-[50px] mr-[45px] md:ml-[80px] ml-[50px] text-quaternary border border-quaternary" />
              <div
                className="flex justify-center"
                onClick={() => {
                  handleDropdown(id);
                }}
              >
                {/* <span onClick={() => rotateArrow1()}>
                  <ArrowDownIconcon
                    className={`float-right cursor-pointer ${
                      isAdminPage ? 'mr-5' : ''
                    } ${rotate1 ? 'rotate-180' : ''}`}
                  />
                </span> */}
              </div>
            </div>
            <div
              className={`my-10 sm:mx-5 md:mx-0 ${
                isAdminPage
                  ? `${selectedCards.includes(id) ? '' : 'hidden'}`
                  : `${selectedCards.includes(id) ? '' : 'hidden'}`
              }`}
            >
              <p className="text-center my-6 text-xl font-medium text-quaternary mx-10">
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
                      : 'font-medium text-[26px]'
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
                        : 'font-medium text-[26px]'
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
                      : 'font-medium text-[26px]'
                  }`}
                >
                  Área de Gerenciamento
                </p>
              </div>

              {smartAd > 0 && (
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
                        : 'font-medium text-[26px]'
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
                ? ` ${selectedCards.includes(id) ? 'flex pt-28' : 'flex'}`
                : `${selectedCards.includes(id) ? 'flex' : 'flex'}`
            }`}
          >
            <button
              className={`rounded-[10px] text-tertiary md:ml-auto mx-auto my-5 font-semibold ${
                isAdminPage
                  ? `${
                      selectedPlanCard === name
                        ? 'bg-secondary w-[180px] h-[44px] text-base'
                        : 'bg-primary w-[180px] h-[44px] text-base'
                    }`
                  : `${
                      selectedPlanCard === name
                        ? 'bg-secondary w-[270px] h-[66px] text-[26px]'
                        : 'bg-primary w-[270px] h-[66px] mt-5 text-[26px]'
                    }`
              }`}
              onClick={() => {
                setSelectedPlanCard(selectedPlanCard != name ? name : '');
              }}
            >
              Assinar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansCardsHidden;
