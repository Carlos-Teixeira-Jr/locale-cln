import { NextPageContext } from 'next';
import { useState } from 'react';
import {
  IAddress,
  IData,
  IGeolocation,
  IOwnerInfo,
  IPrices,
  ISize,
  announcementType,
  metadataType,
} from '../../common/interfaces/property/propertyData';
import DynamicMap from '../../components/atoms/maps/dinamycMap';
import StaticMap from '../../components/atoms/maps/map';
import ContactBox from '../../components/molecules/contactBox/ContactBox';
import Gallery from '../../components/molecules/gallery/gallery';
import PropertyInfoTop from '../../components/molecules/property/propertyInfoTop';
import Footer from '../../components/organisms/footer/footer';
import Header from '../../components/organisms/header/header';
import PropertyInfo from '../../components/organisms/propertyInfo/PropertyInfo';
import useTrackLocation from '../../hooks/trackLocation';
import { NextPageWithLayout } from '../page';
import { getSession } from 'next-auth/react';
import { fetchJson } from '../../common/utils/fetchJson';

export interface IIDPage {
  location: IGeolocation;
  prices: IPrices;
  metadata: metadataType;
  highlighted: boolean;
  images: string[];
  property: string;
  properties: any;
  address: IAddress;
  size: ISize;
  adType: announcementType;
  href: String;
  ownerInfo: IOwnerInfo;
}

interface IPropertyPage {
  property: IData
  isFavourite: boolean
}

const PropertyPage: NextPageWithLayout<IPropertyPage> = ({ 
  property,
  isFavourite
}: any) => {
  console.log("🚀 ~ file: [id].tsx:50 ~ isFavourite:", isFavourite)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  const { latitude, longitude } = useTrackLocation();
  const latitudeToNumber = parseFloat(latitude);
  const longitudeToNumber = parseFloat(longitude);
  const [backdropActive, setBackdropActive] = useState(true);

  const handleMapButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const divToRemove = document.getElementById('backdrop');
    const mapToRemove = document.getElementById('static-map');
    divToRemove?.remove();
    mapToRemove?.remove();
    setBackdropActive(false);
  };

  return (
    <>
      <div className={`fixed top-0 md:w-full ${isModalOpen ? '' : 'z-40'}`}>
        <Header />
      </div>
      <div className="flex flex-col max-w-[1232px] items-center mx-auto lg:pt-10 pt-[90px]">
        <div className="lg:mx-auto mx-5 mb-[150px] md:mb-5 mt-5">
          <Gallery propertyID={property} isModalOpen={isModalOpen} />
        </div>
        <div className="lg:flex">
          <PropertyInfoTop propertyID={property} />

          <ContactBox
            propertyID={property}
            href={`https://api.whatsapp.com/send/?phone=5553991664864&text=Ol%C3%A1%2C+estou+interessado+no+im%C3%B3vel+${property.address}.+Gostaria+de+mais+informa%C3%A7%C3%B5es.&type=phone_number&app_absent=0`}
            onModalIsOpenChange={handleModalOpenChange}
          />
        </div>

        <div className="md:max-w-[768p]">
          <PropertyInfo 
            property={property} 
            isFavourite={isFavourite}
          />
        </div>
        {/* IMÓVEIS RELACIONADOS */}
        {/* <div className="sm:grid sm:grid-cols-1 md:grid md:grid-cols-2 lg:flex lg:flex-row justify-center gap-9 mx-14 my-10 inline max-w-screen-2xl">
          {props.property && (
            <PropertyCard
              key={id}
              prices={prices}
              description={description}
              images={images}
              location={location} // geolocation
              bedrooms={bedrooms}
              bathrooms={bathrooms}
              parking_spaces={parking_spaces}
              id={id}
              highlighted={highlighted}
            />
          )}
        </div> */}
        <div className="lg:w-[1312px] md:h-[446px] mx-auto md:mb-[150px] drop-shadow-xl">
          <div id="static-map">
            <StaticMap
              lat={latitudeToNumber}
              lng={longitudeToNumber}
              width={1312}
              height={223}
              onClick={handleMapButtonClick}
            />
          </div>
          <div
            id="dynamic-map"
            className={
              backdropActive
                ? 'hidden'
                : 'md:w-[1312px] h-[446px] mx-auto md:mb-[150px] drop-shadow-xl'
            }
          >
            <DynamicMap lat={latitudeToNumber} lng={longitudeToNumber} />
          </div>
        </div>
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default PropertyPage;

export async function getServerSideProps(context: NextPageContext) {

  const session = await getSession(context) as any;
  const userId = session?.user.data._id;
  const propertyId = context.query.id;
  const baseUrl = process.env.BASE_API_URL;
  let isFavourite;

  if (userId) {
    const fetchFavourites = await Promise.all([
      fetch(`${baseUrl}/user/favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
        })
      })
      .then((res) => res.json())
      .catch(() => []),
      fetchJson(`${baseUrl}/user/favourite`),
    ]);
    if (fetchFavourites.length > 0) {

      isFavourite = fetchFavourites.some((prop) => prop._id === propertyId);
    }
  }

  const property = await fetch(`${baseUrl}/property/${propertyId}`)
    .then((res) => res.json())
    .catch(() => {})
  
  return {
    props: {
      property,
      isFavourite
    },
  };
}
