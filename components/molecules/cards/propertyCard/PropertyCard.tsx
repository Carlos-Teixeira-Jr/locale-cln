import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import BathroomIcon from '../../../atoms/icons/bathroomIcon';
import BedroomIcon from '../../../atoms/icons/bedroomIcon';
import DotIcon from '../../../atoms/icons/dotIcon';
import HeartIcon from '../../../atoms/icons/heartIcon';
import ParkingIcon from '../../../atoms/icons/parkingIcon';
import formatCurrency from '../../../atoms/masks/currencyFormat';

export interface IPropertyCard {
  _id: string;
  prices: string;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  images: string[];
  location: string;
  favorited?: boolean;
  highlighted: boolean;
}

const PropertyCard: React.FC<IPropertyCard> = ({
  _id,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Expande o tamanho do corpo do card para mostrar todo o texto;
  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  // Verifica se o texto excede os limites do corpo do card e atribui esse valor ao estado isExpandable;
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

  //useMemo - parâmetros:
  //1º: uma função em que o retorno será o valor que o useMemo irá armazenar e retornar para a sua variável, sendo assim sua variável será sempre igual ao valor de retorno dessa função.
  //2º: um array de dependências.
  const memoizedCardImage = useMemo(() => {
    return images[currentIndex];
  }, [images, currentIndex]);

  const memoizedCardInfos = useMemo(() => {
    return {
      _id,
      prices,
      description,
      bedrooms,
      bathrooms,
      parking_spaces,
      location,
    };
  }, [_id, prices, description, bedrooms, bathrooms, parking_spaces, location]);

  const priceToInt = parseInt(prices);
  const formattedPrice = formatCurrency(priceToInt);

  return (
    <div
      className={`flex flex-col max-w-[350px] bg-tertiary shadow-lg rounded-[30px] mt-2 cursor-pointer ${
        expanded ? `min-h-[470px] max-h-fit` : 'max-h-[470px]'
      }`}
    >
      <Link href={`/property/${_id}`}>
        {/* caroussel */}
        <div className="group relative h-[200px]">
          {/* Images */}
          <div className="flex flex-row w-full overflow-hidden scroll-smooth rounded-t-[30px] h-[200px]">
            <Image
              src={memoizedCardImage}
              key={currentIndex}
              alt={'Property Image'}
              width="350"
              height="200"
            />
            {highlighted && (
              <div className="bg-black absolute m-5 rounded-lg bg-opacity-50">
                <p className="text-white p-2 h-fit font-semibold">Destaque</p>
              </div>
            )}
          </div>
          {/* Arrow buttons */}
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
                <svg
                  aria-hidden="true"
                  className="hidden group-hover:block w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
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
                <svg
                  aria-hidden="true"
                  className="hidden group-hover:block w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
          {/* Dots */}
          <div className="flex top-4 justify-center mt-[-28px]">
            {images.map((images: string, imagesIndex: number) => (
              <div
                key={imagesIndex}
                onClick={() => goToImage(imagesIndex)}
                className={`${
                  imagesIndex === currentIndex
                    ? 'text-tertiary'
                    : 'text-[#D9D9D9]/70'
                } cursor-pointer `}
              >
                <DotIcon />
              </div>
            ))}
          </div>
        </div>
        {/* Property Info */}
        <div className="px-4">
          {favorited ? (
            <div className="flex flex-row items-center">
              <h1 className="font-bold text-2xl text-[#000000]">
                {formattedPrice}
              </h1>
              <span className="ml-36">
                <HeartIcon />
              </span>
            </div>
          ) : (
            <h1 className="font-bold text-2xl text-[#000000]">
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
              whiteSpace: 'initial',
            }}
            className="font-medium text-sm text-quaternary mt-4 max-w-[350px] text-justify"
          >
            {memoizedCardInfos.description}
          </p>
          {descriptionRef.current && isExpandable && (
            <span
              onClick={toggleExpanded}
              className="font-medium text-sm text-primary mt-4 max-w-[350px] text-justify"
            >
              {!expanded ? 'Ler mais...' : 'Ler menos...'}
            </span>
          )}

          <h3 className="font-bold text-sm text-quaternary mt-4">
            {memoizedCardInfos.location}
          </h3>
        </div>
        {/* Property tags */}
        <div className={`flex flex-row items-end justify-around mb-7 mt-4`}>
          {memoizedCardInfos.bedrooms && (
            <div className="flex flex-row items-center justify-between">
              <BedroomIcon fill="#6B7280" />
              <span className="font-bold text-2xl text-quaternary ml-2">
                {memoizedCardInfos.bedrooms}
              </span>
            </div>
          )}
          {memoizedCardInfos.parking_spaces && (
            <div className="flex flex-row items-center justify-between">
              <ParkingIcon fill="#6B7280" />
              <span className="font-bold text-2xl text-quaternary ml-2">
                {memoizedCardInfos.parking_spaces}
              </span>
            </div>
          )}
          {memoizedCardInfos.bathrooms && (
            <div className="flex flex-row items-center justify-between">
              <BathroomIcon fill="#6B7280" />
              <span className="font-bold text-2xl text-quaternary ml-2">
                {memoizedCardInfos.bathrooms}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
