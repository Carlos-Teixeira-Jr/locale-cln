import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { IData } from '../../../../common/interfaces/property/propertyData';
import BathroomIcon from '../../../atoms/icons/bathroomIcon';
import BedroomIcon from '../../../atoms/icons/bedroomIcon';
import DotIcon from '../../../atoms/icons/dotIcon';
import NextCardIcon from '../../../atoms/icons/nextCardIcon';
import ParkingIcon from '../../../atoms/icons/parkingIcon';
import PreviousCardIcon from '../../../atoms/icons/previousCardIcon';
import formatCurrency from '../../../atoms/masks/currencyFormat';
import MessageModal from '../../../atoms/modals/messageModal';
import { monetaryFormat } from '../../../../common/utils/masks/monetaryFormat';
Modal.setAppElement('#__next');

export interface IPropertyInfoCard {
  _id: string;
  prices: string;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  images: string[];
  location: string;
  href: string;
  highlighted: boolean;
  propertyInfo: IData;
}

export interface IFormData {
  name: string;
  telephone: string;
  email: string;
  message: string;
}

const PropertyInfoCard: React.FC<IPropertyInfoCard> = ({
  prices,
  description,
  bedrooms,
  bathrooms,
  parking_spaces,
  images,
  location,
  href,
  highlighted,
  propertyInfo,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isExpandable, setIsExpandable] = useState(false);
  const formattedPrice = monetaryFormat(prices);
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

  const prevImage = (event: MouseEvent) => {
    event.preventDefault();
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextImage = (event: MouseEvent) => {
    event.preventDefault();
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (imageIndex: number) => {
    setCurrentIndex(imageIndex);
  };

  const handleMessageBtnClick = (event: MouseEvent) => {
    event.preventDefault();
    setModalIsOpen(true);
  };

  return (
    <>
      <Link href={href}>
        <div
          className={` bg-tertiary md:grid md:grid-cols-3 rounded-[30px] overflow-hidden drop-shadow-lg my-7 md:mx-9 mx-2 flex flex-col ${
            expanded ? 'lg:h-fit' : 'lg:h-[255px]'
          }`}
        >
          <div className="group relative md:h-[200px]">
            {/* Images */}
            <div className="flex flex-row w-full overflow-hidden scroll-smooth rounded-tl-[30px] md:h-[265px] h-[250px]">
              <Image
                src={images[currentIndex]}
                key={currentIndex}
                alt={'Property Image'}
                width="312"
                height="265"
                className="w-full"
              />
              {highlighted && (
                <div className="bg-black absolute m-5 rounded-lg bg-opacity-50">
                  <p className="text-white p-2 h-fit font-semibold">Destaque</p>
                </div>
              )}
            </div>
            {/* Arrow buttons */}
            <div className="absolute w-full top-[80px] lg:top-[115px] flex items-center justify-between">
              <button
                type="button"
                onClick={prevImage}
                className="z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="hidden group-hover:inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-[#D9D9D9]/80 group-hover:bg-white/50 group-focus:outline-none">
                  <PreviousCardIcon />
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="hidden group-hover:inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-[#D9D9D9]/80 group-hover:bg-white/50 group-focus:outline-none">
                  <NextCardIcon />
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
                  className="text-[#D9D9D9]/70 hover:text-tertiary cursor-pointer"
                >
                  <DotIcon />
                </div>
              ))}
            </div>
          </div>

          <div className="md:flex justify-between md:flex-col md:gap-4 md:col-span-2 md:ml-11 my-auto mx-[17px] md:mx-4">
            <div
              className={`${
                prices.length > 10 ? 'md:w-[270px]' : 'md:w-[240px]'
              } text-3xl md:w-[240px] h-[44px] top-[17px] left-[336px] font-bold text-[#000000]`}
            >
              {formattedPrice}
            </div>
            <div className="flex flex-col">
              <p
                className="font-medium text-xs leading-4 text-quaternary md:w-[383px] h-fit"
                ref={descriptionRef}
                style={{
                  overflow: expanded ? 'visible' : 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  lineClamp: expanded ? 'unset' : 2,
                  WebkitLineClamp: expanded ? 'unset' : 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {description}
              </p>
              {descriptionRef.current && isExpandable && (
                <span
                  onClick={toggleExpanded}
                  className="font-medium text-sm text-primary max-w-[350px] text-end"
                >
                  {!expanded ? 'Ler mais...' : 'Ler menos...'}
                </span>
              )}
            </div>
            <div className="flex items-center md:py-auto py-2">
              <p className="font-bold text-xs leading-4 text-quaternary md:w-[266px] h-[15px]">
                {location}
              </p>
            </div>
            <div className="grid grid-auto-cols grid-flow-col gap-3 pb-6 md:pb-5 items-center">
              <div className="grid grid-auto-cols grid-flow-col gap-1">
                <div className="md:w-fit h-fit">
                  <BedroomIcon fill="#6B7280" />
                </div>
                <div className="font-bold text-2xl md:ml-[0.2rem] text-quaternary flex items-center justify-center">
                  {bedrooms}
                </div>
              </div>
              <div className="grid grid-auto-cols grid-flow-col gap-1">
                <div className="md:w-fit h-fit">
                  <ParkingIcon fill="#6B7280" />
                </div>
                <div className="font-bold text-2xl md:ml-[0.2rem]  text-quaternary flex items-center justify-center">
                  {parking_spaces}
                </div>
              </div>
              <div className="grid grid-auto-cols grid-flow-col gap-1">
                <div className="md:w-fit h-fit">
                  <BathroomIcon fill="#6B7280" />
                </div>
                <div className="font-bold text-2xl md:ml-[0.2rem] text-quaternary flex items-center justify-center">
                  {bathrooms}
                </div>
              </div>
              <button
                className="bg-primary md:w-[200px] h-full md:h-[50px] rounded-full transition-colors duration-300 hover:bg-red-600 hover:text-white"
                onClick={handleMessageBtnClick}
              >
                <p className="md:w-[176px] md:h-[24px] font-normal text-sm px-2 md:text-lg lg:text-xl text-tertiary flex mx-auto my-1 lg:my-0 align-middle justify-center py-0 sm:py-1 md:py-0 lg:py-0 xl:py-0 mb-1 md:mb-1 lg:mb-0">
                  Enviar Mensagem
                </p>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {modalIsOpen && (
        <MessageModal
          isOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
          propertyInfo={propertyInfo}
        />
      )}
    </>
  );
};

export default PropertyInfoCard;
