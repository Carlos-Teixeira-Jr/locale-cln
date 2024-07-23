import Link from 'next/link';
import { useState } from 'react';
import store from 'store';
import LocationIcon from '../../../atoms/icons/location';
import PlusIcon from '../../../atoms/icons/plusIcon';
import LocaleLogo from '../../../atoms/logos/locale';

export interface IPlansCard {
  _id: string;
  name: string;
  price: number;
  commonAd: number;
  highlightAd: number;
  smartAd: number;
}

const PlansCards: React.FC<IPlansCard> = ({
  _id,
  name,
  price,
  commonAd,
  highlightAd,
  smartAd,
}) => {

  const [getPlan, setGetPlan] = useState('645a46d4388b9fbde84b6e8a');
  const getUserPlan = (planId: string) => {
    setGetPlan(planId);
    store.set('plans', planId);
  };

  return (
    <div
      className="md:flex justify-center md:my-10"
      onClick={() => getUserPlan(_id)}
    >
      <Link href={'/register'}>
        <div className="md:mx-5 my-5 md:my-0">
          <div className="flex bg-primary rounded-t-[30px] md:w-80 md:h-[65px]">
            <div className="flex m-auto">
              <h2 className="font-bold text-[40px] text-tertiary mr-3">
                Plano
              </h2>
              <h2 className="font-bold text-[40px] text-secondary">
                {name === 'Locale Plus' ? (
                  <div className="">
                    <div className="bg-tertiary rounded-full flex h-[39px] mt-2">
                      <LocaleLogo className="mt-0.5" />
                      <PlusIcon fill="#F5BF5D" className="pb-2" />
                    </div>
                  </div>
                ) : (
                  name
                )}
              </h2>
            </div>
          </div>
          <div className="bg-tertiary rounded-b-[30px] md:w-80 h-fit pb-5 drop-shadow-lg transition-shadow duration-300 hover:shadow-2xl ease-in-out">
            <div className="md:h-80 h-fit">
              <h1 className="text-5xl font-normal leading-[60px] py-6 text-center">
                {price === 0 ? 'GRÁTIS' : `R$ ${price},00`}
              </h1>
              <hr className="w-[300px] text-center mx-auto text-quaternary" />
              <p className="text-center my-6 text-xl font-medium text-quaternary mx-10">
                {/* Com o plano {name.toUpperCase()} você tem direito a: */}
              </p>
              <div className="my-7">
                <div className="flex mx-10 mb-5">
                  <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                    <LocationIcon fill="white" />
                  </div>
                  <p className="font-medium text-lg text-quaternary leading-7">
                    {commonAd > 1
                      ? `${commonAd} Ofertas Comuns`
                      : `${commonAd} Oferta Comum`}
                  </p>
                </div>

                {highlightAd > 0 && (
                  <div className="flex mx-10 mb-5">
                    <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                      <LocationIcon fill="white" />
                    </div>
                    <p className="font-medium text-lg text-quaternary leading-7">
                      {highlightAd > 1
                        ? `${highlightAd} Ofertas Destaque`
                        : `${highlightAd} Oferta Destaque`}
                    </p>
                  </div>
                )}

                {name === 'Locale Plus' && (
                  <div className="flex mx-10">
                    <div className="w-[26px] h-[26px] shrink-0 flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                      <LocationIcon fill="white" />
                    </div>
                    <p className="font-medium text-lg text-quaternary leading-7">
                      Compra de créditos de anúncio e destaque.
                    </p>
                  </div>
                )}

                {/* <div className="flex mx-10">
                  <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                    <LocationIcon fill="white" />
                  </div>
                  <p className="font-medium text-lg text-quaternary leading-7">
                    Área de Gerenciamento
                  </p>
                </div> */}

                {/* {smartAd > 0 && (
                  <div className="grid grid-flow-col mx-10 mb-7 mt-3">
                    <div className="w-[26px] h-[26px] flex items-center justify-center my-auto mr-2 bg-primary rounded-full">
                      <LocationIcon fill="white" />
                    </div>
                    <p className="font-medium text-lg text-quaternary leading-7">
                      Criação de Anúncios Inteligentes.
                    </p>
                  </div>
                )} */}
              </div>
            </div>
            <div className="flex mx-auto">
              <button className="bg-primary rounded-[10px] text-tertiary w-64 h-[66px] mx-auto text-2xl font-semibold transition-colors duration-300 hover:bg-red-600 hover:text-white">
                Assinar
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PlansCards;
