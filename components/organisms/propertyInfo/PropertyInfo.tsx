import clipboardy from 'clipboardy';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import {
  IData,
  IMetadata,
} from '../../../common/interfaces/property/propertyData';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalizeFirstLetter';
import {
  ErrorToastNames,
  SuccessToastNames,
  showErrorToast,
  showSuccessToast,
} from '../../../common/utils/toasts';
import FavouritedIcon from '../../atoms/icons/favouritedIcon';
import UnfavouritedIcon from '../../atoms/icons/unfavouritedIcon';
import CalculatorModal from '../../atoms/modals/calculatorModal';
import LinkCopiedTooltip from '../../atoms/tooltip/Tooltip';
import FavouritePropertyTooltip from '../../atoms/tooltip/favouritePropertyTooltip';

export interface ITooltip {
  globalEventOff: string;
}

export interface IPropertyInfo {
  property: IData;
  isFavourite: boolean;
}

const PropertyInfo: React.FC<IPropertyInfo> = ({ property, isFavourite }) => {
  const session = useSession() as any;
  const status = session.status;
  const router = useRouter();

  const userIsLogged = status === 'authenticated' ? true : false;
  const userId = session?.data?.user?.data?._id;

  const [tooltipIsVisible, setTooltipIsVisible] = useState(false);

  const [favPropTooltipIsVisible, setFavPropTooltipIsVisible] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [favourited, setFavourited] = useState(isFavourite);

  const [haveTags, setHaveTags] = useState<boolean>(false);

  const handleCopy = async () => {
    setTooltipIsVisible(true);

    const currentUrl = `${window.location.origin}${router.asPath}`;

    try {
      await clipboardy.write(currentUrl);
      console.log('Valor copiado para a área de transferência:', currentUrl);
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
    setFavPropTooltipIsVisible(false);
  };

  const handleCalculatorBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setModalIsOpen(true);
  };

  const handleFavouriteBtnClick = async (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!userIsLogged) {
      setFavPropTooltipIsVisible(true);
    } else {
      const { _id: propertyId } = property;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/user/edit-favourite`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              propertyId,
            }),
          }
        );

        if (response.ok) {
          const newFavoutedList: string[] = await response.json();
          const isFavourited = newFavoutedList.includes(propertyId);

          if (isFavourited) {
            setFavourited(true);
            showSuccessToast(SuccessToastNames.FavouriteProperty);
          } else {
            setFavourited(false);
            showErrorToast(ErrorToastNames.FavouriteProperty);
          }
        } else {
          showErrorToast(ErrorToastNames.FavouriteProperty);
        }
      } catch (error) {
        showErrorToast(ErrorToastNames.ServerConnection);
      }
    }
  };

  const getMetadataValue = (type: string) => {
    const value = property.metadata?.find(
      (metadata: IMetadata) => metadata.type === type
    )?.amount;
    return value;
  };

  useEffect(() => {
    if (property.tags) {
      setHaveTags(true);
    }
  }, [property.tags]);

  return (
    <>
      <div className="flex flex-row py-1 md:py-5 px-4 lg:w-full bg-tertiary drop-shadow-lg">
        <div className="flex flex-col">
          <h1 className="font-extrabold text-quaternary md:text-2xl text-lg">
            Características do imóvel
          </h1>
          <h3 className="font-extrabold text-quaternary text-lg pt-6 pb-2">
            Dependências
          </h3>
          <div className="flex flex-row items-center justify-start gap-1 text-left">
            <div className="flex flex-col text-quaternary text-md">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </div>
            <div className="flex flex-col text-quaternary text-md">
              <h3>{getMetadataValue('bedroom')}</h3>
              <h3>{getMetadataValue('bathroom')}</h3>
              <h3>{getMetadataValue('garage')}</h3>
            </div>
            <div className="flex flex-col text-quaternary text-md">
              <h3>quarto(s)</h3>
              <h3>banheiro(s)</h3>
              <h3>garagem(s)</h3>
            </div>
          </div>
          {haveTags && (
            <h3 className="font-extrabold text-quaternary text-2xl pt-6 pb-2">
              Outras características
            </h3>
          )}
          {haveTags &&
            property?.tags.map((tag) => (
              <div key={tag} className="flex flex-col items-start">
                <div className="flex flex-col">
                  <div className="font-normal text-md text-quaternary flex flex-row lg:justify-between gap-1">
                    <span>•</span>
                    <span>{tag}</span>
                  </div>
                </div>
              </div>
            ))}
          <div className="pt-6">
            <h3 className="font-extrabold text-quaternary text-2xl pb-2 md:pb-4">
              Descrição
            </h3>
            <p className="font-normal text-md text-quaternary text-justify pr-5">
              {capitalizeFirstLetter(property.description)}
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-10 md:my-auto lg:mx-2 justify-items-center gap-5 md:gap-0">
          <LinkCopiedTooltip
            open={tooltipIsVisible}
            onRequestClose={hideTooltip}
            anchorId={'tooltip'}
          />
          <button
            id="tooltip"
            className="lg:w-[320px] w-40 h-12 md:h-[67px] md:w-full bg-primary p-2.5 rounded-[10px] text-tertiary text-lg font-extrabold mb-6"
            onClick={handleCopy}
          >
            Compartilhar
          </button>

          {property.acceptFunding && (
            <button
              className="lg:w-80 md:w-full md:h-16 h-12 bg-primary p-2.5 rounded-[10px] text-tertiary text-lg font-extrabold mb-6 md:flex md:items-center md:justify-center"
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
            id="fav-property-tooltip"
            className={`lg:w-80 w-40 md:w-full h-12 md:h-16 bg-primary p-2.5 rounded-[10px] text-tertiary text-lg font-extrabold flex justify-center items-center mb-5 ${
              userIsLogged ? 'opacity opacity-100 cursor-pointer' : 'opacity-50'
            }`}
            onClick={handleFavouriteBtnClick}
          >
            <p className="my-auto pr-4">Favoritar</p>
            {favourited ? (
              <FavouritedIcon width="34" height="34" className="pb-4 md:pb-0" />
            ) : (
              <UnfavouritedIcon
                width="34"
                height="34"
                className="pb-4 md:pb-0"
              />
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
