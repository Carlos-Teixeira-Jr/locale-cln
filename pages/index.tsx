import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ILocation } from '../common/interfaces/locationDropdown';
import { IData, IPropertyInfo } from '../common/interfaces/property/propertyData';
import { IPropertyTypes } from '../common/interfaces/property/propertyTypes';
import HomeFilter from '../components/atoms/filterSections/HomeFilter';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import useTrackLocation from '../hooks/trackLocation';
import { NextPageWithLayout } from './page';
import AccessCard from '../components/molecules/cards/accessCards/AccessCard';
import { fetchJson } from '../common/utils/fetchJson';

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
  console.log("🚀 ~ file: index.tsx:33 ~ propertyInfo:", propertyInfo)

  const { latitude, longitude, location } = useTrackLocation();
  const [propertiesByLocation, setPropertiesByLocation] = useState<any>([]);
  const [propertiesByLocationError, setPropertiesByLocationError] = useState(null);
  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.BUY
  );

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
            `http://localhost:3001/property/filter/?page=1&limit=3&filter=${locationFilterParam}`
          )
            .then((res) => res.json())
            .catch(() => ({}));

          setPropertiesByLocation(response);
        }catch(error: any){
          setPropertiesByLocationError(error.message)
          console.error(`Houve um erro ao pegar as coordenadas da localização do usuário. Erro: ${propertiesByLocationError}`)
        }
      }
    }
    fetchPropertiesByLocation();
  }, [latitude, longitude, location]);

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
          />
        </div>

        <div className="md:absolute flex justify-center md:justify-end xl:justify-center2 xl:max-w-[1536px] xl:pl-[600px] mt-[55px] lg:pr-11 lg:mr-28 lg:top-20 md:top-[25px] lg:left-0 md:p-4 w-full">
          <HomeFilter 
            isBuyProp={isBuy} 
            isRentProp={isRent} 
            setBuyProp={handleSetBuy} 
            setRentProp={handleSetRent} 
            propertyTypesProp={propertyTypes}
            locationProp={locations}
          />
        </div>

        <div className="inline max-w-screen-2xl">
          <div className="mb-20">
            <AccessCard 
              isBuyProp={isBuy} 
              isRentProp={isRent} 
            />
          </div>

          <div className="flex sm:flex-col md:flex-row justify-center mb-3 px-2">
            <div className="flex flex-row lg:w-fit px-4">
              {propertiesByLocation.length != 0 ? (
                <div className="flex flex-col lg:w-fit w-full m-auto align-middle mt-[9px]">
                  <h3 className="sm:text-base md:text-[26px] font-bold text-quaternary md:text-left text-center">
                    Veja os imóveis mais próximos de você!
                  </h3>
                </div>
              ) : (
                <div className="flex flex-col lg:w-fit text-center w-full m-auto align-middle ">
                  <h3 className="sm:text-base md:text-[26px] font-bold text-quaternary md:text-left text-center">
                    Veja os imóveis em destaque!
                  </h3>
                </div>
              )}
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 lg:flex lg:flex-row justify-center gap-9 mx-14">
            {/* ISSO COMENTADO ABAIXO É O CÓDIGO QUE RENDERIZA APENAS OS CARDS REFERENTES A LOCALIZAÇÃO DO USUÁRIO */}
            {propertiesByLocation.docs ? (
              propertiesByLocation.docs.map(
                ({
                  _id,
                  prices,
                  description,
                  address,
                  images,
                  metadata,
                  highlighted
                }: any) => (
                  <PropertyCard
                    key={_id}
                    prices={prices[0].value}
                    description={description}
                    images={images}
                    location={address.streetName}
                    bedrooms={metadata[0].amount}
                    bathrooms={metadata[1].amount}
                    parking_spaces={metadata[2].amount}
                    _id={_id} 
                    highlighted={highlighted}                  
                  />
                )
              )
            ) : (
              propertyInfo.docs?.map(
                ({
                  _id,
                  prices,
                  description,
                  address,
                  images,
                  metadata,
                  highlighted
                }: IData) => (
                  <PropertyCard
                    key={_id}
                    prices={prices[0]}
                    description={description}
                    images={images}
                    location={address.streetName}
                    bedrooms={metadata[0].amount}
                    bathrooms={metadata[1].amount}
                    parking_spaces={metadata[2].amount}
                    _id={_id} 
                    highlighted={highlighted}                  
                  />
                )
              )
            )}
            
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
  const baseUrl = process.env.BASE_API_URL;

  const [propertyInfo, propertyTypes, locations] = await Promise.all([
    fetch(`${baseUrl}/property?page=1&limit=3`)
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/property-type`)
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/location`)
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/property?page=1&limit=3`),
    fetchJson(`${baseUrl}/property-type`),
    fetchJson(`${baseUrl}/location`),
  ]);
  console.log("🚀 ~ file: index.tsx:218 ~ getStaticProps ~ propertyInfo:", propertyInfo)

  return {
    props: {
      propertyInfo: propertyInfo,
      propertyTypes: propertyTypes,
      locations: locations,
    },
  };
}
