import { useState } from 'react';
import ArrowDownIconcon from '../components/atoms/icons/arrowDownIcon';
import Address from '../components/molecules/address/address';
import UploadImages from '../components/molecules/uploadImages/uploadImages';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import MainFeatures from '../components/organisms/mainFeatures/mainFeatures';
import PropertyDifferentials from '../components/organisms/register/propertyDifferential';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';

const NewAd: NextPageWithLayout = () => {
  const [rotate1, setRotate1] = useState(false);
  const [rotate2, setRotate2] = useState(false);
  const [rotate3, setRotate3] = useState(false);
  const [rotate4, setRotate4] = useState(false);

  const showHide = (element: string) => {
    const classList = document.getElementById(element)?.classList;
    classList?.contains('hidden')
      ? classList?.remove('hidden')
      : classList?.add('hidden');

    document.getElementById('accordion-1')?.classList?.contains('hidden')
      ? setRotate1(true)
      : setRotate1(false);

    document.getElementById('accordion-2')?.classList?.contains('hidden')
      ? setRotate2(true)
      : setRotate2(false);

    document.getElementById('accordion-3')?.classList?.contains('hidden')
      ? setRotate3(true)
      : setRotate3(false);

    document.getElementById('accordion-4')?.classList?.contains('hidden')
      ? setRotate4(true)
      : setRotate4(false);
  };

  return (
    <div>
      <AdminHeader />
      <div className="flex flex-row justify-center lg:justify-end xl:justify-end 2xl:justify-center">
        <div className="fixed left-0 top-7  sm:hidden hidden md:hidden lg:flex">
          <SideMenu isPlus={false} />
        </div>
        <div className="flex flex-col items-center mt-16 max-w-[900px] text-xl lg:text-4xl px-2 md:px-10">
          <h1 className="font-bold text-2xl lg:text-4xl text-quaternary mb-10 mt-20">
            Novo Anúncio
            <div className="accordion flex flex-col">
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-1"
                  className="hidden"
                  onClick={() => showHide('accordion-1')}
                />
                <label
                  htmlFor="painel-1"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-20 bg-tertiary border-2 border-quaternary mt-10 px-8"
                >
                  Endereço
                  <span className={`${rotate1 ? '' : 'rotate-180'}`}>
                    <ArrowDownIconcon />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-1"
                >
                  <p className="accordion__body p-4" id="painel1">
                    <Address />
                  </p>
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-2"
                  className="hidden"
                  onClick={() => showHide('accordion-2')}
                />
                <label
                  htmlFor="painel-2"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-20 bg-tertiary border-2 border-quaternary mt-10 px-8"
                >
                  Fotos
                  <span className={`${rotate2 ? '' : 'rotate-180'}`}>
                    <ArrowDownIconcon />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-2"
                >
                  <p className="accordion__body p-4" id="painel2">
                    <UploadImages />
                  </p>
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-3"
                  className="hidden"
                  onClick={() => showHide('accordion-3')}
                />
                <label
                  htmlFor="painel-3"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-20 bg-tertiary border-2 border-quaternary mt-10 px-8"
                >
                  Características
                  <span className={`${rotate3 ? '' : 'rotate-180'}`}>
                    <ArrowDownIconcon />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-3"
                >
                  <p className="accordion__body p-4" id="painel3">
                    <MainFeatures />
                  </p>
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-4"
                  className="hidden"
                  onClick={() => showHide('accordion-4')}
                />
                <label
                  htmlFor="painel-4"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-20 bg-tertiary border-2 border-quaternary mt-10 px-8"
                >
                  Outras Características
                  <span className={`${rotate4 ? '' : 'rotate-180'}`}>
                    <ArrowDownIconcon />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-4"
                >
                  <p className="accordion__body p-4" id="painel4">
                    <PropertyDifferentials shouldRenderCondDiv={true} />
                  </p>
                </div>
              </div>
            </div>
            <div className="flex self-end justify-end mb-32 mt-16">
              <button className="bg-primary w-96 h-24 rounded">
                <span className="text-quinary font-bold text-2xl lg:text-4xl p-2">
                  Salvar Dados
                </span>
              </button>
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default NewAd;
