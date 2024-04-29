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
  ownerData
}: IPropertyPage) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapIsActive, setMapIsActive] = useState(false);
  const dynamicRoute = useRouter().asPath;

  useEffect(() => {
    setMapIsActive(false);
  }, [dynamicRoute]);

  const galeryModalCSS = `lg:mx-auto md:m-5 mb-0 lg:mb-36. md:mb-5 md:mt-0 lg:mt-5  ${isModalOpen ? 'z-50' : 'z-30'
    }`;

  return (
    <>
      <div className={classes.content}>
        <div className={galeryModalCSS}>
          <Gallery
            propertyID={property}
            isModalOpen={isModalOpen}
            onGalleryModalOpen={(isOpen: boolean) => setIsModalOpen(isOpen)}
          />
        </div>

        <div className="md:flex w-full justify-between mb-4">
          <PropertyInfoTop propertyID={property} />

          <ContactBox property={property} ownerInfo={ownerData?.owner} />
        </div>

        <div className="w-full h-fit">
          <PropertyInfo
            property={property}
            isFavourite={isFavourite}
            owner={ownerData}
          />
        </div>

        <div className={classes.relatedProperties}>
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

        <div className={classes.mapContainer}>
          {!mapIsActive && (
            <div id="dynamic-map" className={classes.staticMap}>
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

      <Footer />
    </>
  );
};

export default PropertyPage;

export async function getStaticPaths() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const propertiesResponse = await fetch(`${baseUrl}/property/filter/?page=1&limit=100`);
  const properties = await propertiesResponse.json();
  const paths = properties.docs.map((property: IData) => ({
    params: { id: property._id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(context: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let property;
  let isFavourite: boolean = false;
  let ownerData;
  let ownerId;

  try {
    const propertyResponse = await fetch(
      `${baseUrl}/property/${context.params.id}?isEdit=false`
    );

    if (propertyResponse.ok) {
      property = await propertyResponse.json();
      ownerId = property.owner;
    } else {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (property?.ownerInfo) {
    try {
      const fetchUser = await fetch(`${baseUrl}/user/find-user-by-owner/${ownerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (fetchUser.ok) {
        ownerData = await fetchUser.json();

        const userId = ownerData.user._id

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
                (prop: IData) => prop._id === context.params.id
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
        ownerData = null;
        console.error('Não foi possível achar o usuário.');
      }
    } catch (error) {
      console.error('Não foi possível achar o usuário.');
    }
  } else {
    isFavourite = false;
  }

  const url = `${baseUrl}/property/filter/?page=1&limit=4`;
  const relatedProperties = await fetch(url).then((res) => res.json());

  return {
    props: {
      property,
      isFavourite,
      relatedProperties,
      ownerData,
    },
    revalidate: 60
  };
}

const classes = {
  content: 'flex flex-col max-w-5xl items-center mx-auto lg:pt-10 pt-[90px]',
  relatedProperties:
    'flex flex-col md:flex-row gap-5 justify-center m-5 lg:my-5 lg:mx-0',
  mapContainer: 'w-full md:h-fit mx-auto mb-20 drop-shadow-xl',
  staticMap: 'lg:w-full h-fit my-10 mx-auto drop-shadow-xl',
};
