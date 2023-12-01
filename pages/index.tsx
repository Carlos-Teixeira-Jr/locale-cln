import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ILocation } from '../common/interfaces/locationDropdown';
import {
  IData,
  IPropertyInfo,
} from '../common/interfaces/property/propertyData';
import { IPropertyTypes } from '../common/interfaces/property/propertyTypes';
import { fetchJson } from '../common/utils/fetchJson';
import HomeFilter from '../components/atoms/filterSections/HomeFilter';
import AccessCard from '../components/molecules/cards/accessCards/AccessCard';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import useTrackLocation from '../hooks/trackLocation';
import { NextPageWithLayout } from './page';

export interface IHome {
  propertyInfo: IPropertyInfo;
  propertyTypes: IPropertyTypes[];
  locations: ILocation[];
}

export enum TransactionType {
  // eslint-disable-next-line no-unused-vars
  BUY = 'comprar',
  // eslint-disable-next-line no-unused-vars
  RENT = 'alugar',
}

const Home: NextPageWithLayout<IHome> = ({
  propertyInfo,
  propertyTypes,
  locations,
}) => {
  const { latitude, longitude, location } = useTrackLocation();
  const [propertiesByLocation, setPropertiesByLocation] = useState<any>([]);
  const [propertiesByLocationError, setPropertiesByLocationError] =
    useState(null);
  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);

  //Altera o valor de isBuy sempre que o valor correspondente é alterado no componente HomeFilter;
  const handleSetBuy = (value: boolean) => {
    setIsBuy(value);
  };

  //Altera o valor de isRent sempre que o valor correspondente é alterado no componente HomeFilter;
  const handleSetRent = (value: boolean) => {
    setIsRent(value);
  };

  //Esse hook realiza a busca no DB a partir da localização do usuário.
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

  return (
    <>
      <div>
        <div className="fixed z-10 top-0 w-full">
          <Header />
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

        <div className="md:absolute flex flex-col md:flex-row justify-center md:justify-end lg:justify-end xl:justify-end xl:pl-[600px] md:mt-20 lg:pr-11 lg:top-20 md:top-[25px] lg:left-0 md:p-4 md:mx-auto w-full p-5 md:inset-x-0 lg:inset-x-10">
          <HomeFilter
            isBuyProp={isBuy}
            isRentProp={isRent}
            setBuyProp={handleSetBuy}
            setRentProp={handleSetRent}
            propertyTypesProp={propertyTypes}
            locationProp={locations}
          />
        </div>

        <div className="max-w-[1232px] flex sm:items-center md:items-center flex-col m-auto">
          <h3 className="sm:text-base md:text-2xl font-bold text-quaternary lg:text-left text-center mt-5 md:ml-5">
            O que você procura a um clique de distância
          </h3>
          <div className="mb-5 lg:mb-10">
            <AccessCard />
          </div>

          <div className="flex max-w-[1232px]  justify-center text-left">
            <h3 className="sm:text-base md:text-2xl font-bold text-quaternary text-center md:text-left ml-5">
              {propertiesByLocation.length != 0
                ? 'Veja os imóveis mais próximos de você!'
                : 'Veja os imóveis em destaque!'}
            </h3>
          </div>
          <div className="flex sm:flex-col max-w-[1232px] justify-center items-center md:flex-row  mb-3 px-2">
            <div className="flex flex-row px-4">
              <div className="flex flex-col m-auto align-middle mt-2">
                <div className="sm:grid sm:grid-cols-1 md:flex md:flex-row md:flex-wrap lg:flex-nowrap justify-center md:gap-10">
                  {/* ISSO COMENTADO ABAIXO É O CÓDIGO QUE RENDERIZA APENAS OS CARDS REFERENTES A LOCALIZAÇÃO DO USUÁRIO */}
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
                        }: any) => (
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
                          />
                        )
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <Footer smallPage={false} />
        </div>
      </div>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const [propertyInfo, propertyTypes, locations] = await Promise.all([
    fetch(`${baseUrl}/property/filter/?page=1&limit=4`)
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/property-type`)
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/location`)
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/property/filter/?page=1&limit=4`),
    fetchJson(`${baseUrl}/property-type`),
    fetchJson(`${baseUrl}/location`),
  ]);

  return {
    props: {
      propertyInfo: propertyInfo,
      propertyTypes: propertyTypes,
      locations: locations,
    },
    revalidate: propertyInfo?.docs?.length > 0 ? 60 : 1,
  };
}
