import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ILocation } from '../common/interfaces/locationDropdown';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import {
  IData,
  IPropertyInfo,
} from '../common/interfaces/property/propertyData';
import { IPropertyTypes } from '../common/interfaces/property/propertyTypes';
import { isCardVisualized } from '../common/utils/actions/isCardVisualized';
import { saveVisualizedCards } from '../common/utils/actions/saveVisualizedCards';
import { fetchJson, handleResult } from '../common/utils/fetchJson';
import HomeFilter from '../components/atoms/filterSections/HomeFilter';
import { AccessCard, PropertyCard } from '../components/molecules/cards';
import { Footer, Header } from '../components/organisms';
import useTrackLocation from '../hooks/trackLocation';
import { NextPageWithLayout } from './page';

export interface IHome {
  propertyInfo: IPropertyInfo;
  propertyTypes: IPropertyTypes[];
  locations: ILocation[];
  ownerProperties: IOwnerProperties
}

export enum TransactionType {
  BUY = 'comprar',
  RENT = 'alugar',
}

const defaultOwnerProperties: IOwnerProperties = {
  docs: [],
  count: 0,
  totalPages: 0,
  messages: []
};

const Home: NextPageWithLayout<IHome> = ({
  propertyInfo,
  propertyTypes,
  locations,
  ownerProperties = defaultOwnerProperties
}) => {

  const { latitude, longitude, location } = useTrackLocation();
  const [propertiesByLocation, setPropertiesByLocation] = useState<any>([]);
  const [propertiesByLocationError, setPropertiesByLocationError] =
    useState(null);
  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);
  const isOwner = ownerProperties?.docs.length > 0;
  const { push } = useRouter();
  const [isAlreadyClicked, setIsAlreadyClicked] = useState<null | boolean>(null);
  const [params, setParams] = useState('');

  const handleSetBuy = (value: boolean) => {
    setIsBuy(value);
  };

  const handleSetRent = (value: boolean) => {
    setIsRent(value);
  };

  useEffect(() => {
    async function fetchPropertiesByLocation() {
      if (location) {
        try {
          const geolocation = [{ latitude: latitude, longitude: longitude }];
          const locationFilterParam = encodeURIComponent(
            JSON.stringify(geolocation)
          );

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/property/filter/?page=1&limit=3&filter=${locationFilterParam}`
          )
            .then((res) => res.json())
            .catch(() => ({}));

          setPropertiesByLocation(response);
        } catch (error: any) {
          setPropertiesByLocationError(error.message);
          console.error(
            `Houve um erro ao pegar as coordenadas da localização do usuário. Erro: ${propertiesByLocationError}`
          );
        }
      }
    }
    fetchPropertiesByLocation();
  }, [latitude, longitude, location, propertiesByLocationError]);

  const handleCardClick = (id: string, params: string) => {
    const alreadyClicked = isCardVisualized(id);
    if (!alreadyClicked) {
      saveVisualizedCards(id);
    }
    setIsAlreadyClicked(alreadyClicked);
    setParams(params);
  };

  // insere a flag de incrementação de visualizações do imóvel na url;
  useEffect(() => {
    let newParams;
    if (isAlreadyClicked !== null) {
      const firstSubstring = params.split('increment=')[0];

      const lastSubstring = params.split('increment=')[1];

      newParams = firstSubstring + `increment=${!isAlreadyClicked}` + lastSubstring

      push(`/property/${newParams}`)
    }
  }, [isAlreadyClicked, params]);

  return (
    <>
      <div className='min-h-screen flex flex-col'>

        <div className='flex flex-col flex-grow'>
          <div className="fixed z-10 top-0 w-full">
            <Header userIsOwner={isOwner} />
          </div>

          <div className="z-0">
            <Image
              src="/images/header-image.png"
              alt="Banner"
              width={1440}
              height={920}
              className="w-full"
              priority
            />
          </div>

          <div className={classes.homeFilter}>
            <HomeFilter
              isBuyProp={isBuy}
              isRentProp={isRent}
              setBuyProp={handleSetBuy}
              setRentProp={handleSetRent}
              propertyTypesProp={propertyTypes}
              locationProp={locations}
            />
          </div>

          <div className={classes.content}>
            <h3 className={classes.title}>
              O que você procura a um clique de distância
            </h3>
            <div className="mb-5 lg:mb-10">
              <AccessCard />
            </div>

            {propertiesByLocation.length > 0 ||
              (propertyInfo?.docs?.length > 0 && (
                <div className={classes.subTitleContainer}>
                  <h3 className={classes.subTitle}>
                    {propertiesByLocation.length != 0
                      ? 'Veja os imóveis mais próximos de você!'
                      : 'Veja os imóveis em destaque!'}
                  </h3>
                </div>
              ))}

            <div className={classes.cardContainer}>
              <div className="flex flex-row md:px-4">
                <div className="flex flex-col m-auto align-middle mt-2">
                  <div className={classes.propertiesByLocation}>
                    {propertiesByLocation.docs
                      ? propertiesByLocation.docs.map(
                        ({
                          _id,
                          prices,
                          description,
                          address,
                          images,
                          metadata,
                          highlighted,
                          adType,
                          propertyType,
                        }: IData) => (
                          <PropertyCard
                            key={_id}
                            prices={prices}
                            description={description}
                            images={images}
                            location={address.streetName}
                            bedrooms={metadata[0].amount}
                            bathrooms={metadata[1].amount}
                            parking_spaces={metadata[2].amount}
                            id={_id}
                            highlighted={highlighted}
                            adType={adType}
                            propertyType={propertyType}
                            address={address}
                            onCardClick={(id: string, params: string) => handleCardClick(id, params)}
                          />
                        )
                      )
                      : propertyInfo.docs?.map(
                        ({
                          _id,
                          prices,
                          description,
                          address,
                          images,
                          metadata,
                          highlighted,
                          adType,
                          propertyType,
                        }: IData) => (
                          <PropertyCard
                            key={_id}
                            prices={prices}
                            description={description}
                            images={images}
                            location={address.streetName}
                            bedrooms={metadata[0].amount}
                            bathrooms={metadata[1].amount}
                            parking_spaces={metadata[2].amount}
                            id={_id}
                            highlighted={highlighted}
                            adType={adType}
                            propertyType={propertyType}
                            address={address}
                            onCardClick={(id: string, params: string) => handleCardClick(id, params)}
                          />
                        )
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = 1;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let ownerData;
  let ownerProperties = defaultOwnerProperties;

  try {
    const ownerIdResponse = await fetch(
      `${baseUrl}/user/find-owner-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (ownerIdResponse.ok) {
      const response = await ownerIdResponse.json();
      if (response?.owner?._id) {
        ownerData = response;

        ownerProperties = await fetch(`${baseUrl}/property/owner-properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId: ownerData?.owner?._id,
            page,
          }),
        })
          .then((res) => res.json())
          .catch(() => defaultOwnerProperties);
      } else {
        ownerProperties = defaultOwnerProperties;
      }
    } else {
      ownerData = {};
    }
  } catch (error) {
    console.error(`Error:`, error)
  }

  const promises = [
    fetchJson(`${baseUrl}/property/filter/?page=1&limit=4`),
    fetchJson(`${baseUrl}/property-type`),
    fetchJson(`${baseUrl}/location`),
  ];

  const results = await Promise.allSettled(promises);

  const propertyInfoResult = results[0];
  const propertyTypesResult = results[1];
  const locationsResult = results[2];

  const propertyInfo = handleResult(propertyInfoResult);
  const propertyTypes = handleResult(propertyTypesResult);
  const locations = handleResult(locationsResult);

  return {
    props: {
      propertyInfo,
      propertyTypes,
      locations,
      ownerProperties: ownerProperties ?? defaultOwnerProperties
    },
  };
}

const classes = {
  content:
    'max-w-7xl flex flex-grow sm:items-center md:items-center flex-col m-auto',
  cardContainer:
    'flex sm:flex-col max-w-7xl justify-center items-center md:flex-row mb-3 px-2',
  title:
    'text-base lg:text-xl font-bold text-quaternary text-center mt-5 md:ml-5',
  subTitleContainer: 'flex max-w-7xl justify-center text-left',
  subTitle:
    'text-base lg:text-xl font-bold text-quaternary text-center md:text-left ml-5"',
  homeFilter:
    'md:absolute flex flex-col md:flex-row justify-center md:justify-end lg:justify-end xl:justify-end 2xl:justify-center xl:pl-[600px] md:mt-20 lg:pr-11 lg:top-20 md:top-[25px] lg:left-0 md:p-4 md:mx-auto w-full p-5 md:inset-x-0 lg:inset-x-10',
  propertiesByLocation:
    'sm:grid sm:grid-cols-1 md:flex md:flex-row md:flex-wrap lg:flex-nowrap justify-center md:gap-10',
};
