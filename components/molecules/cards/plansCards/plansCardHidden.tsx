import { useEffect, useState } from 'react';
import ArrowDownIcon from '../../../atoms/icons/arrowDownIcon';
import LocationIcon from '../../../atoms/icons/location';
import PlusIcon from '../../../atoms/icons/plusIcon';
import LocaleLogo from '../../../atoms/logos/locale';
import AdCreditsTooltip from '../../../atoms/tooltip/adCreditsTooltip';

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
  isEdit: boolean;
  userPlan?: string;
  ownerCredits?: number;
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
  userPlan,
  ownerCredits
}) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [tooltipISOpen, setTooltipIsOpen] = useState(true);

  const handleDropdown = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  useEffect(() => {
    if (userPlan) setSelectedPlanCard(userPlan);
  }, [userPlan]);

  const dinamicClasses = {
    cardContainer: `md:mx-auto my-5 lg:my-0 rounded-t-[35px] rounded-b-[30px] border-[5px] h-fit ${selectedPlanCard === id ? 'border-secondary' : 'border-none'
      }`,
    adminHeader: `${isAdminPage ? classes.cardAdminHeader : classes.cardHeader
      }`,
    planTitle: `${isAdminPage ? classes.planAdminTitle : classes.planTitle}`,
    planType: `${isAdminPage ? classes.planAdminType : classes.planType}`,
    contentContainer: `bg-tertiary rounded-b-[30px] p-2 drop-shadow-lg ${isAdminPage
      ? `md:w-[230px] ${selectedCards.includes(id) ? 'h-fit' : 'h-fit'}`
      : `md:w-60 ${selectedCards.includes(id) ? 'h-fit' : 'h-fit'}`
      }`,
    content: `${isAdminPage
      ? `${selectedCards.includes(id)
        ? 'h-fit'
        : 'h-fit flex flex-col justify-center'
      }`
      : `${selectedCards.includes(id) ? 'h-fit pb-5' : 'h-fit pb-5'}`
      }`,
    arrowDown: `float-right cursor-pointer transform transition-transform duration-300 ${isAdminPage ? 'mr-5' : 'mr-5'
      } ${selectedCards.includes(id) ? 'rotate-180' : ''}`,
    detailsContainer: `my-1 sm:mx-5 md:mx-0 ${isAdminPage
      ? `${selectedCards.includes(id) ? '' : 'hidden'}`
      : `${selectedCards.includes(id) ? '' : 'hidden'}`
      }`,
    locationAndLabel: `${isAdminPage ? 'flex mx-3 mb-5' : 'flex mx-10 mb-7'}`,
    iconLabel: `text-quaternary leading-7 ${isAdminPage ? 'font-medium text-base' : 'font-medium text-xl'
      }`,
    highlightContainer: `${isAdminPage ? 'flex mx-3 mb-5' : 'flex mx-10 mb-7'}`,
    p: `text-quaternary leading-7 ${isAdminPage ? 'font-medium text-base' : 'font-medium text-xl'
      }`,
    smartAd: `${isAdminPage ? 'flex mx-3 mb-5 ' : 'grid grid-flow-col mx-10 mb-7 mt-4'
      }`,
    buttonContainer: `${isAdminPage
      ? ` ${selectedCards.includes(id) ? 'flex' : 'flex'}`
      : `${selectedCards.includes(id) ? 'flex' : 'flex'}`
      }`,
    button: `rounded-[10px] text-tertiary mx-auto transition-colors duration-300 my-5 font-semibold ${isAdminPage
      ? `${selectedPlanCard === id
        ? `bg-secondary hover:bg-yellow-500 w-[180px] h-[44px] text-base ${selectedCards.includes(id) ? 'mt-5' : ''
        }`
        : 'bg-primary hover:bg-red-500 w-[180px] h-[44px] text-base'
      }`
      : `w-full h-[66px] mt-5 mx-5 text-xl ${selectedPlanCard === id ? 'bg-secondary hover:bg-yellow-500' : 'bg-primary hover:bg-red-500 '
      }`
      }`,
  };

  return (
    <div
      className={`${isAdminPage ? classes.adminPage : classes.notAdminPage}`}
      id={`card-${id}`}
    >
      <div className={dinamicClasses.cardContainer}>
        <div className={dinamicClasses.adminHeader}>
          <div className="flex items-center m-auto">
            <h2 className={dinamicClasses.planTitle}>Plano</h2>
            <h2 className={dinamicClasses.planType}>
              {name === 'Locale Plus' ? (
                <div className={classes.localePlus}>
                  <LocaleLogo className="mt-0.5" width="85" />
                  <PlusIcon fill="#F5BF5D" className="pb-[15px]" width="35" />
                </div>
              ) : (
                name
              )}
            </h2>
          </div>
        </div>
        <div className={dinamicClasses.contentContainer}>
          <div className={dinamicClasses.content}>
            <h1 className={classes.contentTitle}>
              {price === 0 ? 'GRÁTIS' : `R$ ${price},00`}
            </h1>
            <div className="flex w-full">
              <hr className={classes.divider} />
              <div
                className="flex justify-center"
                onClick={() => {
                  handleDropdown(id);
                }}
              >
                <span onClick={() => handleDropdown(id)}>
                  <ArrowDownIcon className={dinamicClasses.arrowDown} />
                </span>
              </div>
            </div>
            <div className={dinamicClasses.detailsContainer}>
              <p className={classes.p}>
                Com o plano {name.toUpperCase()} você tem direito a:
              </p>
              <div className={dinamicClasses.locationAndLabel}>
                <div className={classes.locationIcon}>
                  <LocationIcon fill="white" />
                </div>
                <p className={dinamicClasses.iconLabel}>
                  {commonAd > 1
                    ? `${commonAd} Ofertas Comuns`
                    : `${commonAd} Oferta Comum`}
                </p>
              </div>

              {highlightAd > 0 && (
                <div className={dinamicClasses.highlightContainer}>
                  <div className={classes.locationIcon}>
                    <LocationIcon fill="white" />
                  </div>
                  <p className={dinamicClasses.iconLabel}>
                    {highlightAd > 1
                      ? `${highlightAd} Ofertas Destaque`
                      : `${highlightAd} Oferta Destaque`}
                  </p>
                </div>
              )}

              <div className={`${isAdminPage ? 'flex mx-3' : 'flex mx-10'}`}>
                <div className={classes.locationShrink}>
                  <LocationIcon fill="white" />
                </div>
                <p className={dinamicClasses.p}>Área de Gerenciamento</p>
              </div>

              {smartAd && (
                <div className={dinamicClasses.smartAd}>
                  <div className={classes.locationShrink}>
                    <LocationIcon fill="white" />
                  </div>
                  <p className={dinamicClasses.p}>
                    Criação de Anúncios Inteligentes.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className={dinamicClasses.buttonContainer}>
            <button
              className={dinamicClasses.button}
              onClick={() => {
                setSelectedPlanCard(selectedPlanCard !== id ? id : '');
              }}
            >
              {selectedPlanCard === id ? 'Meu Plano' : 'Assinar'}
            </button>
          </div>
          {ownerCredits !== undefined && userPlan === id && (
            <div className='w-full'>
              <AdCreditsTooltip
                anchorId={`card-${id}`}
                planName={name}
                creditsLeft={ownerCredits}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlansCardsHidden;

const classes = {
  adminPage: 'flex lg:flex-row justify-center lg:mb-10 mx-10 md:mx-auto',
  notAdminPage:
    'md:flex md:flex-row justify-center md:mb-5 px-5 md:px-0 md:mx-auto',
  cardAdminHeader:
    'flex bg-primary px-1 rounded-t-[30px] md:w-[230px] md:h-[66px]',
  cardHeader: 'flex bg-primary px-1 rounded-t-[30px] md:w-60 md:h-fit py-2',
  planAdminTitle: 'font-bold text-[35px] text-tertiary mr-2',
  planTitle: 'font-bold text-xl md:text-2xl text-tertiary mr-3',
  planAdminType: 'font-bold text-[35px] text-secondary',
  planType: 'font-bold text-lg md:text-xl text-secondary',
  localePlus: 'bg-tertiary rounded-full flex h-[33px] lg:mt-2',
  contentTitle: 'text-3xl font-normal leading-[60px] py-3 text-center',
  divider:
    'w-48 text-center md:mr-8 mr-[45px] md:ml-16 ml-[50px] text-quaternary border border-quaternary',
  p: 'text-center my-2 text-base font-medium text-quaternary mx-8',
  locationIcon:
    'w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full',
  locationShrink:
    'w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full shrink-0',
};
