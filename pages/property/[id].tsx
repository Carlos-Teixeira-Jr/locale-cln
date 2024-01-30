import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
import PropertyCard from '../../components/molecules/cards/propertyCard/PropertyCard';
import ContactBox from '../../components/molecules/contactBox/ContactBox';
import Gallery from '../../components/molecules/gallery/gallery';
import PropertyInfoTop from '../../components/molecules/property/propertyInfoTop';
import Footer from '../../components/organisms/footer/footer';
import PropertyInfo from '../../components/organisms/propertyInfo/PropertyInfo';
import { NextPageWithLayout } from '../page';

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
  docs: IData[];
  page: number;
  totalCount: number;
};

interface IPropertyPage {
  property: IData;
  isFavourite: boolean;
  relatedProperties: RelatedProperties;
  ownerData: any;
}

const PropertyPage: NextPageWithLayout<IPropertyPage> = ({
  property,
  isFavourite,
  relatedProperties,
  ownerData,
}: IPropertyPage) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapIsActive, setMapIsActive] = useState(false);
  const dynamicRoute = useRouter().asPath;

  // Atualiza o valor de mapIsActive quando o usuário clica em um novo card apresentado nesta página;
  useEffect(() => {
    setMapIsActive(false);
  }, [dynamicRoute]);

  console.log('property', property);
  console.log('ownerData', ownerData);

  return (
    <>
      <div
        className={
          'flex flex-col max-w-5xl items-center mx-auto lg:pt-10 pt-[90px]'
        }
      >
        <div
          className={`lg:mx-auto m-5 mb-36 md:mb-5 md:mt-0 lg:mt-5  ${
            isModalOpen ? 'z-50' : 'z-30'
          }`}
        >
          <Gallery
            propertyID={property}
            isModalOpen={isModalOpen}
            onGalleryModalOpen={(isOpen: boolean) => setIsModalOpen(isOpen)}
          />
        </div>
        <div className="md:flex w-full justify-between mb-4">
          <PropertyInfoTop propertyID={property} />

          <ContactBox property={property} ownerInfo={property.ownerInfo} />
        </div>

        <div className="w-full h-fit">
          <PropertyInfo property={property} isFavourite={isFavourite} />
        </div>
        <div className="flex flex-col md:flex-row gap-5 justify-center m-5 lg:my-5 lg:mx-0">
          {relatedProperties.docs.length > 0 &&
            relatedProperties?.docs
              .slice(0, 3)
              .map((prop: IData) => (
                <PropertyCard
                  key={prop._id}
                  prices={prop.prices}
                  description={prop.description}
                  images={prop.images}
                  bedrooms={
                    prop.metadata.find((item) => item.type === 'bedroom')
                      ?.amount
                  }
                  bathrooms={
                    prop.metadata.find((item) => item.type === 'bathroom')
                      ?.amount
                  }
                  parking_spaces={
                    prop.metadata.find((item) => item.type === 'garage')?.amount
                  }
                  id={prop._id}
                  highlighted={prop.highlighted}
                />
              ))}
        </div>
        <div className="w-full md:h-fit mx-auto mb-20 drop-shadow-xl">
          {!mapIsActive && (
            <div
              id="dynamic-map"
              className={'lg:w-full h-fit my-10 mx-auto drop-shadow-xl'}
            >
              <StaticMap
                width={1312}
                height={223}
                geolocation={property.geolocation}
                mapIsActive={mapIsActive}
                onMapChange={(isActive) => setMapIsActive(isActive)}
              />
            </div>
          )}

          <div id="static-map" className={`${mapIsActive ? '' : 'hidden'}`}>
            <DynamicMap geolocation={property.geolocation} />
          </div>
        </div>
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default PropertyPage;

export async function getServerSideProps(context: NextPageContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id;
  const propertyId = context.query.id;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let isFavourite: boolean = false;
  let property;

  if (userId) {
    try {
      const fetchFavourites = await fetch(`${baseUrl}/user/favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          page: 1,
        }),
      });

      if (fetchFavourites.ok) {
        const favourites = await fetchFavourites.json();

        if (favourites.docs.length > 0) {
          isFavourite = favourites.docs.some(
            (prop: any) => prop._id === propertyId
          );
        } else {
          isFavourite = false;
        }
      } else {
        isFavourite = false;
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    isFavourite = false;
  }

  try {
    const propertyResponse = await fetch(
      `${baseUrl}/property/${propertyId}?isEdit=false`
    );

    if (propertyResponse.ok) {
      property = await propertyResponse.json();
    } else {
      return {
        redirect: {
          destination: '/',
          permanent: false, // Se for true, indica um redirecionamento permanente (HTTP 301)
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/',
        permanent: false, // Se for true, indica um redirecionamento permanente (HTTP 301)
      },
    };
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/property/filter/?page=1&limit=4`;
  const relatedProperties = await fetch(url).then((res) => res.json());

  const ownerData = await fetch(`${baseUrl}/user/find-owner-by-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: userId,
    }),
  })
    .then((res) => res.json())
    .catch(() => []);

  return {
    props: {
      property,
      isFavourite,
      relatedProperties,
      ownerData,
    },
  };
}
