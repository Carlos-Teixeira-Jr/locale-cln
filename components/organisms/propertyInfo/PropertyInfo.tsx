import clipboardy from 'clipboardy';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import {
  IData,
  IMetadata,
  IPrices,
} from '../../../common/interfaces/property/propertyData';
import FavouritedIcon from '../../atoms/icons/favouritedIcon';
import UnfavouritedIcon from '../../atoms/icons/unfavouritedIcon';
import CalculatorModal from '../../atoms/modals/calculatorModal';
import LinkCopiedTooltip from '../../atoms/tooltip/Tooltip';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalizeFirstLetter';
import FavouritePropertyTooltip from '../../atoms/tooltip/favouritePropertyTooltip';
import HeartIcon from '../../atoms/icons/heartIcon';
import { useIsMobile } from '../../../hooks/useIsMobile';

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
      <div className="md:grid md:grid-cols-3 py-2 md:py-10 px-5 lg:w-full bg-tertiary drop-shadow-lg">
        <div className="col-span-2">
          <h1 className="font-extrabold text-quaternary md:text-4xl text-2xl">
            Características do imóvel
          </h1>
          <h3 className="font-extrabold text-quaternary text-3xl pt-6 pb-2">
            Dependências
          </h3>
          <div className="lg:grid md:grid-cols-6 md:gap-4 flex">
            <div className="flex flex-col">
              <div className="font-normal text-xl text-quaternary flex md:justify-between gap-2">
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
            <h3 className="font-extrabold text-quaternary text-3xl pb-2 md:pb-4">
              Descrição
            </h3>
            <p className="font-normal text-xl text-quaternary text-justify">
              {capitalizeFirstLetter(property.description)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 mt-10 md:my-auto md:mx-14 justify-items-center">
          <LinkCopiedTooltip
            open={tooltipIsVisible}
            onRequestClose={hideTooltip}
            anchorId={'tooltip'}
          />
          <button
            id="tooltip"
            className="lg:w-[320px] w-40 h-12 md:h-[67px] bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold mb-6"
            onClick={handleCopy}
          >
            Compartilhar
          </button>

          {property.acceptFunding && (
            <button
              className="lg:w-80 md:h-16 h-12 bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold mb-6 md:flex md:items-center md:justify-center"
              onClick={handleCalculatorBtnClick}
            >
              Simular Financiamento
            </button>
          )}

          {!userIsLogged && (
            <FavouritePropertyTooltip 
              open={favPropTooltipIsVisible} 
              onRequestClose={hideFavTooltip} 
              anchorId={'fav-property-tooltip'} 
            />
          )}

          <button
            id='fav-property-tooltip'
            className={`lg:w-80 w-40 h-12 md:h-16 bg-primary p-2.5 rounded-[10px] text-tertiary text-xl font-extrabold flex justify-center mb-5 ${
              userIsLogged ?
              'opacity opacity-100 cursor-pointer' :
              'opacity-50'
            }`}
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
            props={`R$ ${property.prices[0].value}`}
          />
        )}
      </div>
    </>
  );
};

export default PropertyInfo;
