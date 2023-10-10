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
import { NextPageWithLayout } from '../page';
import { getSession } from 'next-auth/react';
import PropertyCard from '../../components/molecules/cards/propertyCard/PropertyCard';

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

type RelatedProperties = {
  docs: IData[],
  page: number,
  totalCount: number
}

interface IPropertyPage {
  property: IData
  isFavourite: boolean
  relatedProperties: RelatedProperties
}

const PropertyPage: NextPageWithLayout<IPropertyPage> = ({ 
  property,
  isFavourite,
  relatedProperties
}: IPropertyPage) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <div className={`fixed top-0 md:w-full ${isModalOpen ? 'z-40' : 'z-50'}`}>
        <Header />
      </div>
      <div className="flex flex-col max-w-5xl items-center mx-auto lg:pt-10 pt-[90px]">
        <div className={`lg:mx-auto m-5 mb-36 md:mb-5 md:mt-0 lg:mt-5 ${
          isModalOpen ?
          'z-50' :
          'z-30'
        }`}>
          <Gallery 
            propertyID={property} 
            isModalOpen={isModalOpen} 
            onGalleryModalOpen={(isOpen: boolean) => setIsModalOpen(isOpen)}
          />
        </div>
        <div className="md:flex w-full justify-between">
          <PropertyInfoTop propertyID={property} />

          <ContactBox
            propertyID={property}
          />
        </div>

        <div className="w-full h-fit">
          <PropertyInfo 
            property={property} 
            isFavourite={isFavourite}
          />
        </div>
        {/* IMÓVEIS RELACIONADOS */}
        <div 
          // className="grid sm:grid-cols-1 md:grid md:grid-cols-2 lg:flex lg:flex-row justify-center gap-9 mx-14 my-10 w-full"
          className='flex flex-col md:flex-row gap-5 justify-center m-5 lg:my-5 lg:mx-0'
        >
          {relatedProperties.docs.length > 0 && relatedProperties?.docs.map((prop: IData) => (
            <PropertyCard
              key={prop._id}
              prices={prop.prices}
              description={prop.description}
              images={prop.images}
              bedrooms={prop.metadata.find((item) => item.type === 'bedroom')?.amount}
              bathrooms={prop.metadata.find((item) => item.type === 'bathroom')?.amount}
              parking_spaces={prop.metadata.find((item) => item.type === 'garage')?.amount}
              id={prop._id}
              highlighted={prop.highlighted}
            />
          ))}
        </div>
        <div className="w-full md:h-fit mx-auto mb-20 drop-shadow-xl">
          <div id="static-map">
            <StaticMap
              width={1312}
              height={223}
              onClick={handleMapButtonClick}
              geolocation={property.geolocation}
            />
          </div>
          <div
            id="dynamic-map"
            className={
              backdropActive
                ? 'hidden'
                : 'lg:w-full h-fit my-10 mx-auto drop-shadow-xl'
            }
          >
            <DynamicMap 
              geolocation={property.geolocation}
            />
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
  let isFavourite: boolean;

  if(userId) {
    const fetchFavourites = await fetch(`${baseUrl}/user/favourite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userId,
      })
    });

    if (fetchFavourites.ok) {
      const favourites = await fetchFavourites.json();

      if (favourites.length > 0) {

        isFavourite = favourites.some((prop: any) => prop._id === propertyId);
      } else {
        isFavourite = false;
      }
    } else {
      isFavourite = false;
    }
  } else {
    isFavourite = false;
  }

  const property = await fetch(`${baseUrl}/property/${propertyId}`)
    .then((res) => res.json())
    .catch(() => {})

  const url = `http://localhost:3001/property/filter/?page=1&limit=3`;
  const relatedProperties = await fetch(url).then((res) => res.json());
  
  return {
    props: {
      property,
      isFavourite,
      relatedProperties
    },
  };
}
