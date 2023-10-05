import clipboardy from 'clipboardy';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { IData, IMetadata } from '../../../common/interfaces/property/propertyData';
import CalculatorModal from '../../atoms/modals/calculatorModal';
import LinkCopiedTooltip from '../../atoms/tooltip/Tooltip';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalizeFirstLetter';
import FavouritePropertyTooltip from '../../atoms/tooltip/favouritePropertyTooltip';

export interface ITooltip {
  globalEventOff: string;
}

export interface IPropertyInfo {
  property: IData;
  isFavourite: boolean
}

const PropertyInfo: React.FC<IPropertyInfo> = ({
  property,
  isFavourite
}) => {

  const session = useSession() as any;
  const status = session.status;
  const userIsLogged = status === 'authenticated' ? true : false;
  const userId = session?.data?.user?.data?._id;
  const [tooltipIsVisible, setTooltipIsVisible] = useState(false);
  const [favPropTooltipIsVisible, setFavPropTooltipIsVisible] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [favourited, setFavourited] = useState(isFavourite);
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

  const hideFavTooltip = () => {
    setFavPropTooltipIsVisible(false)
  }

  const handleCalculatorBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModalIsOpen(true);
  };

  const handleFavouriteBtnClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userIsLogged) {
      setFavPropTooltipIsVisible(true);
    } else {
      const { _id: propertyId } = property;
      try {
        const response = await fetch(`http://localhost:3001/user/edit-favourite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            propertyId
          })
        });
    
        if (response.ok) {
          const newFavoutedList: string[] = await response.json();
          const isFavourited = newFavoutedList.includes(propertyId);
    
          if (isFavourited) {
            setFavourited(true);
            toast.success('Imóvel favoritado com sucesso.')
          } else {
            setFavourited(false);
            toast.success('Imóvel removido dos favoritos.')
          }
        } else {
          toast.error('Houve um erro ao favoritar o imóvel.')
        }
      } catch (error) {
        toast.error('Não foi possível se conectar ao servidor. Tente novamente mais tarde.')
      }
    }
    
  };
  

  const getMetadataValue = (type: string) => {
    const value = property.metadata?.find((metadata: IMetadata) => metadata.type === type)?.amount;
    return (
      value
    );
  };


  return (
    <>
      <div className="md:grid md:grid-cols-3 py-10 px-5 lg:w-full bg-tertiary drop-shadow-lg">
        <div className="col-span-2">
          <h1 className="font-extrabold text-quaternary md:text-4xl text-2xl">
            Características do imóvel
          </h1>
          <h3 className="font-extrabold text-quaternary text-3xl pt-6">
            Dependências
          </h3>
          <div className="lg:grid md:grid-cols-6 md:gap-4 flex">
            <div className="flex flex-col">
              <div className="font-normal text-xl text-quaternary flex justify-between gap-2">
                {getMetadataValue('bedroom')}
                <span>quarto(s)</span>
              </div>
              <div className="font-normal text-xl text-quaternary flex justify-between gap-2">
                {getMetadataValue('bathroom')}
                <span>banheiro(s)</span>
              </div>
              <div className="font-normal text-xl text-quaternary flex justify-between gap-2">
                {getMetadataValue('garage')}
                <span>garagem(s)</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <h3 className="font-extrabold text-quaternary text-3xl leading-[39px] pb-4">
              Descrição
            </h3>
            <p className="font-normal text-xl text-quaternary text-justify">
              {capitalizeFirstLetter(property.description)}
            </p>
          </div>
        </div>
        <div className="md:grid md:grid-col grid md:my-auto my-[40px] md:mx-[62px] justify-center">
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

          {property.acceptFunding && (
            <button
              className="lg:w-80 h-16 bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold mb-6 md:flex md:items-center md:justify-center"
              onClick={handleCalculatorBtnClick}
            >
              Simular Financiamento
            </button>
          )}

          <FavouritePropertyTooltip 
            open={favPropTooltipIsVisible} 
            onRequestClose={hideFavTooltip} 
            anchorId={'fav-property-tooltip'}            
          />

          <button
            id='fav-property-tooltip'
            className={`lg:w-80 h-16 bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold flex justify-center mb-5 ${
              userIsLogged ?
              'opacity opacity-100 cursor-pointer' :
              'opacity-50'
            }`}
            onClick={handleFavouriteBtnClick} 
          >
            <p className="my-auto pr-4">Favoritar</p>
            {favourited ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                viewBox="0 96 960 960"
                width="48"
                fill="#F7F7F6"
              >
                <path d="m480 935-41-37q-106-97-175-167.5t-110-126Q113 549 96.5 504T80 413q0-90 60.5-150.5T290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.5T880 413q0 46-16.5 91T806 604.5q-41 55.5-110 126T521 898l-41 37Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48"
                viewBox="0 96 960 960"
                width="48"
                fill="#F7F7F6"
              >
                <path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z" />
              </svg>
            )}
          </button>
        </div>

        {modalIsOpen && (
          <CalculatorModal
            isOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            props={`R$ ${property.prices[0].value}`}
          />
        )}
      </div>
    </>
  );
};

export default PropertyInfo;
