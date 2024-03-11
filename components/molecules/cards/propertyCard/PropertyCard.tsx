import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IPrices } from '../../../../common/interfaces/property/propertyData';
import { monetaryFormat } from '../../../../common/utils/masks/monetaryFormat';
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
}) => {
  const { data: session } = useSession() as any;
  const userId = session?.user.data.id || session?.user?.data._id;

  const [currentIndex, setCurrentIndex] = useState(0);

  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);

  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault();
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
    return images[currentIndex];
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
    };
  }, [id, prices, description, bedrooms, bathrooms, parking_spaces, location]);

  memoizedCardInfos.bathrooms;

  const price = prices[0].value;
  const formattedPrice = monetaryFormat(price.toString());

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
        toast.error('Ocorreu um erro ao tentar atualizar seus favoritos.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        'Não foi possível estabelecer uma conexão com o servidor. Por favor tente novamente.'
      );
    }
  };

  return (
    <div
      className={`flex flex-col lg:max-w-[270px] md:max-w-[250px] bg-tertiary shadow-lg rounded-[30px] mt-2 cursor-pointer ${expanded ? `min-h-[470px] max-h-fit` : 'max-h-[470px]'
        }`}
    >
      <Link href={`/property/${id}`}>
        <div className="group relative h-[200px]">
          <div className="flex flex-row w-full overflow-hidden scroll-smooth rounded-t-[30px] h-[200px]">
            <Image
              src={memoizedCardImage}
              key={currentIndex}
              alt={'Property Image'}
              width={350}
              height={350}
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
            {images.map((images: string, imagesIndex: number) => (
              <div
                key={imagesIndex}
                onClick={() => goToImage(imagesIndex)}
                className={`${imagesIndex === currentIndex
                    ? 'text-tertiary'
                    : 'text-[#D9D9D9]/70'
                  } cursor-pointer `}
              >
                <DotIcon />
              </div>
            ))}
          </div>
        </div>
        <div
          className={`flex flex-col px-4 mt-2 justify-between ${expanded ? 'h-fit' : 'h-36'
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
            <h1 className="font-bold text-xl text-[#000000]">
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
            className="font-medium text-xs text-quaternary mt-4 max-w-[350px] text-justify"
          >
            {memoizedCardInfos.description}
          </p>
          {descriptionRef.current && isExpandable && (
            <span
              onClick={toggleExpanded}
              className="font-medium text-xs text-primary mt-1 max-w-[350px] text-justify"
            >
              {!expanded ? 'Ler mais...' : 'Ler menos...'}
            </span>
          )}

          <h3 className="font-bold text-xs text-quaternary mt-4">
            {memoizedCardInfos.location}
          </h3>
        </div>
        <div className={`flex flex-row items-end justify-around mb-7 mt-4`}>
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
      </Link>
    </div>
  );
};

export default PropertyCard;
