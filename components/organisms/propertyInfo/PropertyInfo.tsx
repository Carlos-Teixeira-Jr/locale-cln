import clipboardy from 'clipboardy';
import { useRouter } from 'next/router';
import React, { MouseEvent, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import {
  IMetadata,
  IPrices,
} from '../../../common/interfaces/property/propertyData';
import FavouritedIcon from '../../atoms/icons/favouritedIcon';
import UnfavouritedIcon from '../../atoms/icons/unfavouritedIcon';
import CalculatorModal from '../../atoms/modals/calculatorModal';
import LinkCopiedTooltip from '../../atoms/tooltip/Tooltip';

export interface ITooltip {
  globalEventOff: string;
}

export interface IPropertyInfo {
  propertyID: {
    numBedrooms?: IMetadata;
    numBathrooms: IMetadata;
    numGarage: IMetadata;
    description: string;
    prices: IPrices;
    tags: string[];
    condominiumTags: string[];
    acceptFunding?: boolean;
  };
}

const PropertyInfo: React.FC<IPropertyInfo> = ({ propertyID }: any) => {
  const [tooltipIsVisible, setTooltipIsVisible] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    setTooltipIsVisible(true);

    const currentUrl = router.asPath;
    const formattedUrl = `localhost:3000${currentUrl}`;

    try {
      await clipboardy.write(formattedUrl);
      console.log('Valor copiado para a área de transferência:', formattedUrl);
    } catch (err) {
      console.error(
        'Não foi possível copiar o valor para a área de transferência:',
        err
      );
    }
  };

  const hideTooltip = () => {
    setTooltipIsVisible(false);
  };

  const handleCalculatorBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModalIsOpen(true);
  };

  const handleFavouriteBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFavourited(!favourited);
  };

  const getMetadataValue = (type: string) => {
    return (
      propertyID.metadata?.find((metadata: any) => metadata.type === type)
        ?.value || 0
    );
  };

  return (
    <>
      <div className="md:grid md:grid-cols-3 md:max-w-full md:mx-5 lg:w-fit md:top-[1095px] md:left-[69px] bg-tertiary drop-shadow-lg">
        <div className="col-span-2">
          <h1 className="font-extrabold text-quaternary md:text-[40px] text-[25px] leading-[49px] pt-6 pl-3.5">
            Características do imóvel
          </h1>
          <h3 className="font-extrabold text-quaternary text-[32px] leading-[39px] pl-3.5 pt-6">
            Dependências
          </h3>
          <div className="lg:grid md:grid-cols-6 md:gap-4 flex">
            <div className="ml-4 flex flex-col">
              <div className="font-normal text-xl text-quaternary flex justify-between ">
                {getMetadataValue('bedroom')}
                <span> quarto(s)</span>
              </div>
              <div className="font-normal text-xl text-quaternary flex justify-between">
                {getMetadataValue('bathroom')}
                <span> banheiro(s)</span>
              </div>
              <div className="font-normal text-xl text-quaternary flex justify-between">
                {getMetadataValue('parkingSpaces')}
                <span> garagem(s)</span>
              </div>
            </div>
            {/* <div className="ml-4 flex flex-col">
              {propertyID.tags &&
                propertyID.tags.map((tag: string, idx: number) => {
                  <span
                    className="font-normal text-xl text-quaternary"
                    key={idx}
                  >
                    {tag}
                  </span>;
                })}
            </div>
            <div className="ml-4 flex flex-col">
              {propertyID.condominiumTags &&
                propertyID.condominiumTags.map((tag: string, idx: number) => {
                  <span
                    className="font-normal text-xl text-quaternary"
                    key={idx}
                  >
                    {tag}
                  </span>;
                })}
            </div> */}
          </div>
          <div className="pl-3.5 pt-6">
            <h3 className="font-extrabold text-quaternary text-[32px] leading-[39px] pb-4">
              Descrição
            </h3>
            <p className="font-normal text-xl text-quaternary text-justify">
              {propertyID.description}
            </p>
          </div>
        </div>
        <div className="md:grid md:grid-col grid md:my-[140px] my-[40px] md:mx-[62px] justify-center">
          <LinkCopiedTooltip
            open={tooltipIsVisible}
            onRequestClose={hideTooltip}
            anchorId={'tooltip'}
          />
          <button
            id="tooltip"
            className="lg:w-[320px] h-[67px] bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold mb-6"
            onClick={handleCopy}
          >
            Compartilhar
          </button>

          {propertyID.acceptFunding && (
            <button
              className="lg:w-[320px] h-[67px] bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold mb-6 md:flex md:items-center md:justify-center"
              onClick={handleCalculatorBtnClick}
            >
              Simular Financiamento
            </button>
          )}

          <button
            className="lg:w-[320px] h-[67px] bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold flex justify-center mb-5"
            onClick={handleFavouriteBtnClick}
          >
            <p className="my-auto pr-4">Favoritar</p>
            {favourited ? <FavouritedIcon /> : <UnfavouritedIcon />}
          </button>
        </div>

        {modalIsOpen && (
          <CalculatorModal
            isOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            props={`R$ ${propertyID.prices[0].value}`}
          />
        )}
      </div>
    </>
  );
};

export default PropertyInfo;
