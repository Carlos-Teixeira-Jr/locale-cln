import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { toast } from 'react-toastify';
import { IAddress, IPrices } from '../../../../common/interfaces/property/propertyData';
import { monetaryFormat } from '../../../../common/utils/masks/monetaryFormat';
import { ErrorToastNames, showErrorToast } from '../../../../common/utils/toasts';
import BathroomIcon from '../../../atoms/icons/bathroomIcon';
import BedroomIcon from '../../../atoms/icons/bedroomIcon';
import DotIcon from '../../../atoms/icons/dotIcon';
import HeartIcon from '../../../atoms/icons/heartIcon';
import NextIcon from '../../../atoms/icons/nextIcon';
import ParkingIcon from '../../../atoms/icons/parkingIcon';
import PreviousIcon from '../../../atoms/icons/previousIcon';

export interface IPropertyCard {
  id: string;
  prices: IPrices[];
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  images: string[];
  location?: string;
  favorited?: boolean;
  highlighted: boolean;
  adType: string,
  propertyType: string,
  address: IAddress,
  onCardClick: (id: string, params: string) => void
}

const PropertyCard: React.FC<IPropertyCard> = ({
  id,
  prices,
  description,
  bedrooms,
  bathrooms,
  parking_spaces,
  images,
  location,
  favorited,
  highlighted,
  adType,
  propertyType,
  address,
  onCardClick
}) => {

  const { push } = useRouter();
  const { data: session } = useSession() as any;
  const userId = session?.user.data.id || session?.user?.data._id;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const price = prices ? prices[0]?.value : '';
  const formattedPrice = monetaryFormat(price.toString());
  const params = `${adType}+${propertyType}+${address.city}+${address.neighborhood}+${address.streetName}+increment=+id=${id}`
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [loading, setLoading] = useState(false);

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setIsExpandable(isOverflowing);
    }
  }, [description]);

  const prevImage = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextImage = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (imageIndex: number) => {
    setCurrentIndex(imageIndex);
  };

  const memoizedCardImage = useMemo(() => {
    if (images) {
      return images[currentIndex];
    }
  }, [images, currentIndex]);

  const memoizedCardInfos = useMemo(() => {
    return {
      id,
      prices,
      description,
      bedrooms,
      bathrooms,
      parking_spaces,
      location,
      address
    };
  }, [id, prices, description, bedrooms, bathrooms, parking_spaces, location, address]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    trackMouse: true,
  });

  const handleFavouriteIcon = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    try {
      toast.loading(`Enviando...`);
      const response = await fetch(`${baseUrl}/user/edit-favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          propertyId: id,
        }),
      });

      if (response.ok) {
        toast.dismiss();
        window.location.reload();
      } else {
        toast.dismiss();
        showErrorToast(ErrorToastNames.UpdateFavourites)
      }
    } catch (error) {
      toast.dismiss();
      showErrorToast(ErrorToastNames.ServerConnection)
    }
  };

  const handleClick = () => {
    setLoading(true);
    onCardClick(id, params)
  }

  return (
    <div
      className={`flex flex-col max-w-[350px] lg:max-w-[270px] md:max-w-[250px] shadow-lg hover:shadow-2xl rounded-[30px] md:mt-2 mb-2 cursor-pointer w-full p-1 ${expanded ? `min-h-[470px] max-h-fit` : 'max-h-[470px]'
        } ${highlighted ? 'bg-gradient-to-tr from-secondary to-primary' : 'bg-tertiary'}`}
      onClick={handleClick}
    >
      <div className='w-full h-full. bg-tertiary rounded-[30px]'>
        {/* <Link href={`/property/${params}`}> */}
        <div className="group relative h-[200px]" {...swipeHandlers}>
          <div className="flex flex-row w-full overflow-hidden scroll-smooth rounded-t-[30px] h-[200px]">
            <Image
              src={memoizedCardImage ? memoizedCardImage : ''}
              key={currentIndex}
              alt={'Property Image'}
              width={350}
              height={350}
              className='object-cover'
            />
            {highlighted && (
              <div className="bg-black absolute m-5 rounded-lg bg-opacity-50">
                <p className="text-white p-2 h-fit font-semibold">Destaque</p>
              </div>
            )}
          </div>
          <div className="absolute w-full top-[80px] flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                prevImage();
                e.preventDefault();
              }}
              className="z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
              <span className="hidden group-hover:inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-[#D9D9D9]/80 group-hover:bg-white/50 group-focus:outline-none">
                <PreviousIcon />
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                nextImage();
                e.preventDefault();
              }}
              className="z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
              <span className="hidden group-hover:inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-[#D9D9D9]/80 group-hover:bg-white/50 group-focus:outline-none">
                <NextIcon />
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
          <div className="flex top-4 justify-center mt-[-28px]">
            {images?.map((images: string, imagesIndex: number) => (
              <div
                key={imagesIndex}
                onClick={() => goToImage(imagesIndex)}
                className={`overflow-x-hidden ${imagesIndex === currentIndex
                  ? 'text-tertiary'
                  : 'text-[#D9D9D9]/70'
                  } cursor-pointer `
                }
              >
                <DotIcon />
              </div>
            ))}
          </div>
        </div>
        <div
          className={`flex flex-col gap-2 lg:gap-0 mt-2 justify-between ${expanded ? 'h-fit' : 'md:h-28'
            }`}
        >
          {favorited ? (
            <div className="flex flex-row items-center">
              <h1 className="font-bold text-2xl text-[#000000]">
                {formattedPrice}
              </h1>
              <span
                className="ml-36 transition hover:text-red-500 hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFavouriteIcon();
                  return false;
                }}
              >
                <HeartIcon
                  fill="#F75D5F"
                  className="transition hover:text-red-500"
                />
              </span>
            </div>
          ) : (
            <h1 className="font-bold text-xl text-[#000000] px-4">
              {formattedPrice}
            </h1>
          )}
          <p
            ref={descriptionRef}
            style={{
              overflow: expanded ? 'visible' : 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              lineClamp: expanded ? 'unset' : 2,
              WebkitLineClamp: expanded ? 'unset' : 2,
              WebkitBoxOrient: 'vertical',
            }}
            className="font-medium text-xs text-quaternary max-w-[350px] px-4"
          >
            {memoizedCardInfos.description}
          </p>
          {descriptionRef.current && isExpandable && (
            <span
              onClick={toggleExpanded}
              className="font-medium text-xs text-primary max-w-[350px] text-justify px-4"
            >
              {!expanded ? 'Ler mais...' : 'Ler menos...'}
            </span>
          )}

          <h3 className="font-bold text-xs text-quaternary px-4">
            {`${memoizedCardInfos.address?.streetName}, ${memoizedCardInfos.address?.city} - ${memoizedCardInfos.address?.uf}`}
          </h3>
        </div>
        <div className={`flex flex-row items-end justify-around my-4`}>
          <div className="flex flex-row items-center justify-around">
            <BedroomIcon fill="#6B7280" width="30" height="30" />
            <span className="font-bold text-xl text-quaternary ml-2">
              {memoizedCardInfos.bedrooms}
            </span>
          </div>
          <div className="flex flex-row items-center justify-around">
            <ParkingIcon fill="#6B7280" width="30" height="30" />
            <span className="font-bold text-xl text-quaternary ml-2">
              {memoizedCardInfos.parking_spaces}
            </span>
          </div>
          <div className="flex flex-row items-center justify-around">
            <BathroomIcon fill="#6B7280" width="30" height="30" />
            <span className="font-bold text-xl text-quaternary ml-2">
              {memoizedCardInfos.bathrooms}
            </span>
          </div>
        </div>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default PropertyCard;
