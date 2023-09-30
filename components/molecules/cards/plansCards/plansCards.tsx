import LocationIcon from '../../../atoms/icons/location';
import PlusIcon from '../../../atoms/icons/plusIcon';
import LocaleLogo from '../../../atoms/logos/locale';

export interface IPlansCard {
  name: string;
  price: number;
  commonAd: number;
  highlightAd: number;
  smartAd: number;
}

const PlansCards: React.FC<IPlansCard> = ({
  name,
  price,
  commonAd,
  highlightAd,
  smartAd,
}) => {
  return (
    <div className="md:flex justify-center my-10">
      <div className="md:mx-5 my-5 md:my-0">
        <div className="flex bg-primary rounded-t-[30px] md:w-[397px] md:h-[99px]">
          <div className="flex items-center m-auto">
            <h2 className="font-bold text-[40px] text-tertiary mr-3">Plano</h2>
            <h2 className="font-bold text-[40px] text-secondary">
              {name === 'Locale Plus' ? (
                <div className="">
                  <div className="bg-tertiary rounded-full flex h-[39px] mt-2">
                    <LocaleLogo className="mt-0.5" />
                    <PlusIcon fill="#F5BF5D" className="pb-[7px]" />
                  </div>
                </div>
              ) : (
                name
              )}
            </h2>
          </div>
        </div>
        <div className="bg-tertiary rounded-b-[30px] md:w-[397px] h-[610px] drop-shadow-lg">
          <div className="h-[500px]">
            <h1 className="text-5xl font-normal leading-[60px] py-6 text-center">
              {price === 0 ? 'GRÁTIS' : `R$ ${price},00`}
            </h1>
            <hr className="w-[300px] text-center mx-auto text-quaternary" />
            <p className="text-center my-6 text-xl font-medium text-quaternary mx-10">
              Com o plano {name.toUpperCase()} você tem direito a:
            </p>
            <div className="my-10">
              <div className="flex mx-10 mb-7">
                <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                  <LocationIcon fill="white" />
                </div>
                <p className="font-medium text-[26px] text-quaternary leading-7">
                  {commonAd > 1
                    ? `${commonAd} Ofertas Comuns`
                    : `${commonAd} Oferta Comum`}
                </p>
              </div>

              {highlightAd > 0 && (
                <div className="flex mx-10 mb-7">
                  <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                    <LocationIcon fill="white" />
                  </div>
                  <p className="font-medium text-[26px] text-quaternary leading-7">
                    {highlightAd > 1
                      ? `${highlightAd} Ofertas Destaque`
                      : `${highlightAd} Oferta Destaque`}
                  </p>
                </div>
              )}

              <div className="flex mx-10">
                <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                  <LocationIcon fill="white" />
                </div>
                <p className="font-medium text-[26px] text-quaternary leading-7">
                  Área de Gerenciamento
                </p>
              </div>

              {smartAd > 0 && (
                <div className="grid grid-flow-col mx-10 mb-7 mt-3">
                  <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                    <LocationIcon fill="white" />
                  </div>
                  <p className="font-medium text-[26px] text-quaternary leading-7">
                    Criação de Anúncios Inteligentes.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex pr-[65px]">
            <button className="bg-primary rounded-[10px] text-tertiary w-[270px] h-[66px] ml-auto text-[26px] font-semibold">
              Assinar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansCards;
