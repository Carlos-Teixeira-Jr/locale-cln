import clipboardy from 'clipboardy';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { MouseEvent, useEffect, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { IOwnerData } from '../../../common/interfaces/owner/owner';
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
  owner: IOwnerData;
  handleCalculatorIsOpen: (calculatorIsOpen: boolean) => void
}

const PropertyInfo: React.FC<IPropertyInfo> = ({
  property,
  isFavourite,
  owner,
  handleCalculatorIsOpen
}) => {
  console.log("🚀 ~ property:", property)

  const session = useSession() as any;
  const status = session.status;
  const router = useRouter();
  const userIsLogged = status === 'authenticated' ? true : false;
  const userId = session?.data?.user?.data?._id;
  const isOwnProperty = owner?.owner?.userId === userId ? true : false;
  const [tooltipIsVisible, setTooltipIsVisible] = useState(false);
  const [favPropTooltipIsVisible, setFavPropTooltipIsVisible] = useState(false);
  const [calculatorModalIsOpen, setCalculatorModalIsOpen] = useState(false);
  const [favourited, setFavourited] = useState(isFavourite);
  const [haveTags, setHaveTags] = useState<boolean>(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [metadataHasValues, setMetadataHasValues] = useState(false);

  useEffect(() => {
    if (userId) {
      const response = async () => {
        const res = await fetch(`${baseUrl}/user/favourite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId,
            page: 1
          }),
        })

        if (res.ok) {
          const favourites = await res.json();
          const isFavourite = favourites?.docs?.some((fav: { _id: string }) => fav._id === property?._id);
          setFavourited(isFavourite);
        }
      }
      response();
    }
  }, [userId])

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

  const handleCalculatorBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setCalculatorModalIsOpen(true);
    handleCalculatorIsOpen(true)
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
    if (value && value > 0) {
      setMetadataHasValues(true);
    }
    return value;
  };

  useEffect(() => {
    if (property.tags.length > 0) {
      setHaveTags(true);
    }
    console.log(property.prices[1]?.type);
  }, [property.tags]);

  const classes = {
    tagContainer:
      'font-normal text-md text-quaternary flex flex-row lg:justify-between gap-1',
    infoContainer: 'flex flex-col text-quaternary text-md',
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between py-1 md:py-5 px-4 lg:w-full bg-tertiary drop-shadow-lg md:mt-5">
        <div className="flex flex-col">
          <h1 className="font-extrabold text-quaternary md:text-2xl text-lg">
            Características do imóvel
          </h1>
          {metadataHasValues && (
            <>
              <h3 className="font-extrabold text-quaternary text-lg pt-6 pb-2">
                Dependências
              </h3><div className="flex flex-row items-center justify-start gap-1 text-left">
                <div className={classes.infoContainer}>
                  {getMetadataValue('bedroom')! > 0 && (<h3>{' • ' + getMetadataValue('bedroom') + `${getMetadataValue('bedroom')! > 1 ? ' quartos' : ' quarto'}`}</h3>)}
                  {getMetadataValue('bathroom')! > 0 && (<h3>{' • ' + getMetadataValue('bathroom') + `${getMetadataValue('bathroom')! > 1 ? ' banheiros' : ' banheiro'}`}</h3>)}
                  {getMetadataValue('garage')! > 0 && (<h3>{' • ' + getMetadataValue('garage') + `${getMetadataValue('garage')! > 1 ? ' vagas de garagem' : ' caga de garagem'}`}</h3>)}
                </div>
              </div>
            </>
          )}

          {haveTags && (
            <h3 className="font-extrabold text-quaternary text-2xl pt-6 pb-2">
              Outras características
            </h3>
          )}
          {haveTags &&
            property?.tags.map((tag) => (
              <div key={tag} className="flex flex-col items-start">
                <div className="flex flex-col">
                  <div className={classes.tagContainer}>
                    <span>•</span>
                    <span>{tag.toLowerCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          {property.prices[1]?.type == 'IPTU' &&
            property.prices[1]?.value !== null ? (
            <div className="flex flex-col items-start">
              <div className="flex flex-col">
                <div className={classes.tagContainer}>
                  <span>•</span>
                  <span>IPTU: R$ {property.prices[2]?.value}</span>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}

          {property.prices[1]?.value !== null && property.prices[1]?.value > 0 ? (
            <div className="flex flex-col items-start">
              <div className="flex flex-col">
                <div className={classes.tagContainer}>
                  <span>•</span>
                  <span>Condomínio: R$ {property.prices[1]?.value}</span>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="pt-6">
            <h3 className="font-extrabold text-quaternary text-2xl pb-2 md:pb-4">
              Descrição
            </h3>
            <p className="font-normal text-md text-quaternary text-justify pr-5">
              {capitalizeFirstLetter(property.description)}
            </p>
          </div>
          <div className="pt-6">
            <h3 className="font-extrabold text-quaternary text-2xl pb-2 md:pb-4">Código do Anúncio</h3>
            <p className="font-normal text-md text-quaternary text-justify pr-5">{property.announcementCode}</p>
          </div>
        </div>
        <div className="flex flex-col my-5 lg:mt-0 md:w-[40%] lg:mx-2 justify-items-center gap-5 md:gap-0 lg:gap-5">
          <LinkCopiedTooltip
            anchorId={'tooltip'}
          />
          <button
            id="tooltip"
            className="lg:w-[320px] mx-auto md:h-[67px] w-full bg-primary p-2.5 rounded-[10px] text-tertiary text-lg font-extrabold  transition-colors hover:bg-red-600 duration-300"
            onClick={handleCopy}
          >
            Compartilhar
          </button>

          {property.adType === 'comprar' && (
            <button
              className="lg:w-[320px] mx-auto h-fit md:h-[67px] w-full bg-primary p-2.5 rounded-[10px] text-tertiary text-lg font-extrabold  transition-colors hover:bg-red-600 duration-300"
              onClick={handleCalculatorBtnClick}
            >
              Simular Financiamento
            </button>
          )}

          {!userIsLogged && (
            <FavouritePropertyTooltip
              anchorId={'fav-property-tooltip'}
            />
          )}

          {!isOwnProperty && (
            <button
              id="fav-property-tooltip"
              className={`lg:w-80 mx-auto w-full h-12 md:h-16 bg-primary p-2.5 rounded-[10px] text-tertiary text-lg font-extrabold flex justify-center transition-colors items-center lg:mb-0 ${userIsLogged ? 'opacity opacity-100 cursor-pointer hover:bg-red-600 duration-300' : 'opacity-50'
                }`}
              onClick={handleFavouriteBtnClick}
            >
              <p className="my-auto pr-4">Favoritar</p>
              {favourited ? (
                <FavouritedIcon width="34" height="34" />
              ) : (
                <UnfavouritedIcon
                  width="34"
                  height="34"
                />
              )}
            </button>
          )}

        </div>

        {calculatorModalIsOpen && (
          <CalculatorModal
            isOpen={calculatorModalIsOpen}
            setModalIsOpen={setCalculatorModalIsOpen}
            props={`R$ ${property.prices[0].value}`}
          />
        )}
      </div>
    </>
  );
};

export default PropertyInfo;