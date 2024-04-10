import NextImage from 'next/image';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { IData } from '../../../common/interfaces/property/propertyData';
export interface IGalleryModal {
  setModalIsOpen: (isOpen: boolean) => void;
  property: IData;
  selectedImage: number;
  modalIsOpen: boolean;
}

const GalleryModal: React.FC<IGalleryModal> = ({
  setModalIsOpen,
  property,
  selectedImage,
  modalIsOpen
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImage);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Função para carregar a imagem e obter suas dimensões
  useEffect(() => {
    const loadImage = async () => {
      const img = new Image();
      img.src = property.images[currentIndex];
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    };
    loadImage();
  }, [property.images, currentIndex]);

  const prevImage = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage
      ? property.images.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextImage = () => {
    const isLastImage = currentIndex === property.images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className={`right-0 left-0 top-0 my-auto pb-12 bg-black/90 fixed z-[214748364] group inset-x-0 overflow-x-hidden overflow-y-hidden overflow-hidden ${imageDimensions.height < 480 ?
      'lg:bottom-[-21px] md:bottom-[360px] xl:bottom-[670px]' :
      'h-full'
      } transition-opacity duration-700 ${!modalIsOpen ? 'opcaity-0 hidden' : 'opacity-100 visible'}`}>
      <div>
        <AiOutlineClose
          className="hidden group-hover:block absolute top-[4%] md:top-[5%] -translate-x-0 -translate-y-[50%] right-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
          size={50}
          onClick={() => {
            setModalIsOpen(false);
          }}
        />
      </div>
      <div className="flex justify-center h-screen w-full items-center">
        {imageDimensions.width > 0 && imageDimensions.height > 0 && (
          <NextImage
            src={property.images[currentIndex]}
            alt={''}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="rounded-3xl md:mx-5 lg:mx-0"
          />
        )}
      </div>
      <div>
        <BsChevronCompactLeft
          onClick={prevImage}
          className="hidden group-hover:block absolute top-[40%] md:top-[50%] -translate-x-0 -translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
          size={50}
        />
      </div>
      <div>
        <BsChevronCompactRight
          onClick={nextImage}
          className="hidden group-hover:block absolute top-[40%] md:top-[50%] -translate-x-0 -translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
          size={50}
        />
      </div>
      <div className="flex top-4 justify-center py-2">
        <div>
          <p className="font-bold text-[#5E646F] text-3xl mt-4">
            {currentIndex + 1}/{property.images.length}
          </p>
        </div>
      </div>
    </div>
  );
};
export default GalleryModal;
