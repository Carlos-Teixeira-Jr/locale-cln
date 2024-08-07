import { GetServerSidePropsContext } from 'next';
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
import { isCardVisualized } from '../../common/utils/actions/isCardVisualized';
import { saveVisualizedCards } from '../../common/utils/actions/saveVisualizedCards';
import VideoPlayer from '../../components/atoms/videoPlayer/videoPlayer';
import PropertyCard from '../../components/molecules/cards/propertyCard/PropertyCard';
import ContactBox from '../../components/molecules/contactBox/ContactBox';
import Gallery from '../../components/molecules/gallery/gallery';
import PropertyInfoTop from '../../components/molecules/property/propertyInfoTop';
import Footer from '../../components/organisms/footer/footer';
import VisualizationsBox from '../../components/organisms/property-page/visualizationsBox';
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
  const [calculatorIsOpen, setCalculatorIsOpen] = useState(false);
  const [mapIsActive, setMapIsActive] = useState(false);
  const dynamicRoute = useRouter().asPath;
  const { push } = useRouter();
  const [isAlreadyClicked, setIsAlreadyClicked] = useState<null | boolean>(null);
  const [params, setParams] = useState('');

  useEffect(() => {
    setMapIsActive(false);
  }, [dynamicRoute]);

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

  const galeryModalCSS = `lg:mx-auto md:m-5 mb-0 lg:mb-36. md:mb-5 md:mt-0 lg:mt-5  ${isModalOpen ? 'z-50' : calculatorIsOpen ? '' : 'z-30'
    }`;

  return (
    <main className='flex flex-col min-h-screen'>
      <div className={classes.content}>
        <div className={galeryModalCSS}>
          <Gallery
            propertyID={property}
            ownerData={ownerData}
            isModalOpen={isModalOpen || calculatorIsOpen}
            onGalleryModalOpen={(isOpen: boolean) => setIsModalOpen(isOpen)}
          />
        </div>

        <div className="md:flex w-full justify-between mb-4">
          <div className='flex flex-col w-full px-2'>
            <PropertyInfoTop propertyID={property} />
            <VisualizationsBox views={property.views} />
          </div>

          <ContactBox property={property} ownerInfo={ownerData?.owner} />
        </div>

        <div className="w-full h-fit mt-5 md:mt-0">

          <PropertyInfo
            property={property}
            isFavourite={isFavourite}
            owner={ownerData}
            handleCalculatorIsOpen={(calculatorIsOpen: boolean) => setCalculatorIsOpen(calculatorIsOpen)}
          />
        </div>

        {property?.youtubeLink && (
          <div className='my-10 w-full p-5'>
            <VideoPlayer videoUrl={property.youtubeLink} />
          </div>
        )}

        <div className={classes.relatedProperties}>
          {relatedProperties.docs.length > 0 &&
            relatedProperties?.docs
              .filter((item) => item._id !== property._id)
              .slice(0, 3)
              .map((prop: IData) => (
                <PropertyCard
                  key={prop._id}
                  adType={prop.adType}
                  propertyType={prop.propertyType}
                  address={prop.address}
                  prices={prop.prices}
                  description={prop.description}
                  images={prop.images}
                  location={prop.address.streetName}
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
                  onCardClick={(id: string, params: string) => handleCardClick(id, params)}
                />
              ))}
        </div>

        {/* <div className={classes.mapContainer}>
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
        </div> */}
      </div>

      <Footer />
    </main>
  );
};

export default PropertyPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let property;
  let isFavourite: boolean = false;
  let ownerData;
  let ownerId;
  const params = context.params?.id as string;
  const id = params.split('id=')[1];
  // Captura o valor de increment da url para incrementar as vidualizações;
  const firsSubstring = params.split('increment=')[1];
  console.log("🚀 ~ getServerSideProps ~ firsSubstring:", firsSubstring)
  const increment = JSON.parse(firsSubstring?.split('+id')[0]);

  const url = `${baseUrl}/property/filter/?page=1&limit=4`;
  let relatedProperties;

  try {
    const propertyResponse = await fetch(
      `${baseUrl}/property/findOne/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isEdit: false, increment }),
      }
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
                (prop: IData) => prop._id === id
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

  try {
    const response = await fetch(url);
    relatedProperties = await response.json();
  } catch (error) {
    console.error('Error fetching related properties:', error);
    relatedProperties = [];
  }

  return {
    props: {
      property,
      isFavourite,
      relatedProperties,
      ownerData,
    },
    // revalidate: 60
  };
}

const classes = {
  content: 'flex flex-col flex-grow max-w-5xl items-center mx-auto lg:pt-10 pt-[90px]',
  relatedProperties:
    'flex flex-col md:flex-row gap-5 justify-center m-5 lg:my-5 lg:mx-0',
  mapContainer: 'w-full md:h-fit mx-auto mb-20 drop-shadow-xl',
  staticMap: 'lg:w-full h-fit my-10 mx-auto drop-shadow-xl',
};
