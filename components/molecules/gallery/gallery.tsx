import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { IOwnerData } from '../../../common/interfaces/owner/owner';
import { IData } from '../../../common/interfaces/property/propertyData';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CameraIcon from '../../atoms/icons/cameraIcon';
import NextGalleryIcon from '../../atoms/icons/nextGalleryIcon';
import PreviousGalleryIcon from '../../atoms/icons/previousGalleryIcon';
import GalleryModal from '../../atoms/modals/galleryModal';
import Header from '../../organisms/header/header';

export interface IGallery {
  propertyID: IData;
  isModalOpen: boolean;
  onGalleryModalOpen: (isOpen: boolean) => void;
  ownerData: IOwnerData
}

const Gallery: React.FC<IGallery> = ({
  propertyID,
  isModalOpen,
  onGalleryModalOpen,
  ownerData
}: IGallery) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const isOwner = ownerData?.owner ? true : false;

  useEffect(() => {
    onGalleryModalOpen(modalIsOpen);
  }, [modalIsOpen]);

  const prevImage = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage
      ? propertyID.images.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextImage = () => {
    const isLastImage = currentIndex === propertyID.images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const desabilitarScroll = () => {
    document.documentElement.style.overflow = 'hidden'; // Desabilita o scroll na tag HTML
    document.body.style.overflow = 'hidden'; // Desabilita o scroll no corpo da página
  };

  const handleTap = () => {
    setSelectedImage(currentIndex);
    setModalIsOpen(true);
    desabilitarScroll();
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    onTap: handleTap,
  });

  useEffect(() => {
    if (!modalIsOpen) {
      document.documentElement.style.overflowY = 'scroll';
      document.body.style.overflowY = 'hidden';
    }
  }, [modalIsOpen]);

  return (
    <div className="overflow-hidden">
      <div className="z-50">
        {modalIsOpen && (
          <GalleryModal
            setModalIsOpen={setModalIsOpen}
            property={propertyID}
            selectedImage={selectedImage}
            modalIsOpen={modalIsOpen}
          />
        )}
      </div>

      {!isMobile ? (
        <div>
          <Header userIsOwner={isOwner} />
          <div className="hidden max-w-full max-h-[520px] md:flex flex-row items-center gap-1 mt-12">
            {/* Big image */}
            <div
              className={`max-w-[653px] max-h-[520px] bg-[#434343] rounded-l-3xl md:rounded-l-3xl 
                ${isModalOpen ? '' : 'z-30'} text-center`}
            >
              <div className='bg-primary rounded-full w-fit h-fit absolute top-[36rem] ml-5 p-2 flex gap-2cursor-pointer'>
                <CameraIcon />
                <p className='text-sm text-tertiary font-semibold'>{`${propertyID?.images?.length} `}Fotos</p>
              </div>
              <Image
                src={propertyID.images[0]}
                alt={'Property image'}
                width={653}
                height={620}
                id="desabilitarScrollBtn"
                onClick={() => {
                  setModalIsOpen(true);
                  setSelectedImage(0);
                  document
                    ?.getElementById('desabilitarScrollBtn')
                    ?.addEventListener('click', desabilitarScroll);
                }}
                className="cursor-pointer rounded-l-3xl md:rounded-l-3xl w-[653px] h-[300px] md:h-[520px] hover:opacity-25 group object-cover"
              />
              <span
                className="hidden group-hover:relative group-hover:z-50 top-[-270px] font-normal text-2xl text-tertiary"
                style={{ zIndex: 100 }}
              >
                Abrir galeria
              </span>
            </div>
            {/* Tiny 4 images */}
            <div className="hidden md:grid grid-cols-2 gap-1">
              <div
                className={`max-w-[328px] max-h-[260px] bg-[#434343] ${isModalOpen ? '' : 'z-30'
                  }`}
              >
                <Image
                  src={propertyID.images[1]}
                  alt={'Property image'}
                  width={328}
                  height={260}
                  className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group object-cover"
                  id="desabilitarScrollBtn6"
                  onClick={() => {
                    setModalIsOpen(true);
                    setSelectedImage(1);
                    document
                      ?.getElementById('desabilitarScrollBtn6')
                      ?.addEventListener('click', desabilitarScroll);
                  }}
                />
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary object-cover">
                  Abrir galeria
                </span>
              </div>
              <div
                className={`max-w-[328px] max-h-[260px] bg-[#434343] rounded-tr-3xl ${isModalOpen ? '' : 'z-30'
                  }`}
              >
                <Image
                  src={propertyID.images[2]}
                  alt={'Property image'}
                  width={328}
                  height={260}
                  className="group cursor-pointer rounded-tr-3xl w-[328px] h-[260px] hover:opacity-25 group object-cover"
                  id="desabilitarScrollBtn7"
                  onClick={() => {
                    setModalIsOpen(true);
                    setSelectedImage(2);
                    document
                      ?.getElementById('desabilitarScrollBtn7')
                      ?.addEventListener('click', desabilitarScroll);
                  }}
                />
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary">
                  Abrir galeria
                </span>
              </div>

              <div
                className={`max-w-[328px] max-h-[260px] bg-[#434343] ${isModalOpen ? '' : 'z-30'
                  }`}
              >
                {!propertyID.images[3] ? (
                  <Image
                    src={'/images/logo-only-fonts.png'}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group object-cover"
                    id="desabilitarScrollBtn2"
                    onClick={() => {
                      setModalIsOpen(true);
                      setSelectedImage(0);
                      document
                        ?.getElementById('desabilitarScrollBtn2')
                        ?.addEventListener('click', desabilitarScroll);
                    }}
                  />
                ) : (
                  <Image
                    src={propertyID.images[3]}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group object-cover"
                    id="desabilitarScrollBtn3"
                    onClick={() => {
                      setModalIsOpen(true);
                      setSelectedImage(3);
                      document
                        ?.getElementById('desabilitarScrollBtn3')
                        ?.addEventListener('click', desabilitarScroll);
                    }}
                  />
                )}
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary">
                  Abrir galeria
                </span>
              </div>

              <div
                className={`max-w-[328px] max-h-[260px] bg-[#434343] ${isModalOpen ? '' : 'z-30'
                  }`}
              >
                {!propertyID.images[4] ? (
                  <Image
                    src={'/images/logo-only-fonts.png'}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group object-cover"
                    id="desabilitarScrollBtn4"
                    onClick={() => {
                      setModalIsOpen(true);
                      setSelectedImage(0);
                      document
                        ?.getElementById('desabilitarScrollBtn4')
                        ?.addEventListener('click', desabilitarScroll);
                    }}
                  />
                ) : (
                  <Image
                    src={propertyID.images[4]}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group object-cover"
                    id="desabilitarScrollBtn5"
                    onClick={() => {
                      setModalIsOpen(true);
                      setSelectedImage(4);
                      document
                        ?.getElementById('desabilitarScrollBtn5')
                        ?.addEventListener('click', desabilitarScroll);
                    }}
                  />
                )}
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary">
                  Abrir galeria
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Header userIsOwner={isOwner} />
          <div className="group relative md:h-[200px]"  {...handlers}>
            {/* Images */}
            <div className="flex flex-row w-full max-w-max overflow-hidden scroll-smooth h-[350px]">
              <Image
                src={propertyID.images[currentIndex]}
                key={currentIndex}
                alt={'Property Image'}
                width={405}
                height={350}
                className=' object-cover'
                onClick={handleTap}
              />
            </div>
            {/* Index */}
            <div className="flex relative -top-8 left-4 w-9 rounded-lg bg-black opacity-50">
              <span className="text-sm font-normal text-tertiary ml-[7px] z-50">
                {currentIndex + 1}/{propertyID.images.length}
              </span>
            </div>
            {/* Arrow buttons */}
            <div className="absolute w-full top-[170px] flex items-center justify-between">
              <button
                type="button"
                onClick={prevImage}
                className="z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="hidden group-hover:inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-[#D9D9D9]/80 group-hover:bg-white/50 group-focus:outline-none">
                  <PreviousGalleryIcon />
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              >
                <span className="hidden group-hover:inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-[#D9D9D9]/80 group-hover:bg-white/50 group-focus:outline-none">
                  <NextGalleryIcon />
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Gallery;
