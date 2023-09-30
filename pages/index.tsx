import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ILocation } from '../common/interfaces/locationDropdown';
import { IPropertyInfo } from '../common/interfaces/propertyData';
import { IPropertyTypes } from '../common/interfaces/propertyTypes';
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
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.BUY
  );

  useEffect(() => {
    async function fetchPropertiesByLocation() {
      if (location) {
        try {
          const geolocation = [{ latitude: latitude, longitude: longitude }];
          const locationFilterParam = encodeURIComponent(
            JSON.stringify(geolocation)
          );

          const response = await fetch(
            `${process.env.BASE_URL}/property/filter/?page=1&limit=3&filter=${locationFilterParam}`
          ).then((res) => res.json());

          setPropertiesByLocation(response);
        } catch (error: any) {
          // TODO: adicionar toastify com erro
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
            setTransactionType={setTransactionType}
            transactionType={transactionType}
            propertyTypesProp={propertyTypes}
            locationProp={locations}
          />
        </div>

        <div className="inline max-w-screen-2xl">
          <div className="mb-20">
            <AccessCard transactionType={transactionType} />
          </div>

          <div className="flex sm:flex-col md:flex-row justify-center mb-3 px-2">
            <div className="flex flex-row lg:w-fit px-4">
              <div className="flex flex-col lg:w-fit w-full m-auto align-middle mt-[9px]">
                <h3 className="sm:text-base md:text-[26px] font-bold text-quaternary md:text-left text-center">
                  {propertiesByLocation.length != 0
                    ? 'Veja os imóveis mais próximos de você!'
                    : ' Veja os imóveis em destaque!'}
                </h3>
                <div className="sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 lg:flex lg:flex-row justify-center gap-9 mx-14">
                  {propertyInfo &&
                    propertyInfo?.docs?.map(
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
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer smallPage={false} />
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
  ]);

  return {
    props: {
      propertyInfo: propertyInfo || [],
      propertyTypes: propertyTypes || [],
      locations: locations || [],
    },
  };
}
