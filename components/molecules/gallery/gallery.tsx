import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import GalleryModal from '../../atoms/modals/galleryModal';

export interface IGallery {
  propertyID: {
    src: string;
    images: string[];
  };
  isModalOpen: boolean;
}

const Gallery: React.FC<IGallery> = ({ propertyID, isModalOpen }: IGallery) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
    function handleClick(event: any) {
      if (ref && ref.current) {
        const myRef: any = ref.current;
        if (!myRef.contains(event.target)) {
          setModalIsOpen(false);
        }
      }
    }
  });

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  const openModal = (event: any) => {
    event.preventDefault();
    setModalIsOpen(true);
  };

  return (
    <>
      {!isMobile ? (
        <div>
          <div className="hidden max-w-full max-h-[520px] md:flex flex-row items-center gap-1 mt-12">
            {/* Big image */}
            <div
              className={`max-w-[653px] max-h-[520px] bg-[#434343] rounded-l-3xl md:rounded-l-3xl 
                ${isModalOpen ? '' : 'z-30'} text-center`}
            >
              <Image
                src={propertyID.images[0]}
                alt={'Property image'}
                width={653}
                height={620}
                onClick={openModal}
                className="cursor-pointer rounded-l-3xl md:rounded-l-3xl w-[653px] h-[300px] md:h-[520px] hover:opacity-25 group"
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
                className={`max-w-[328px] max-h-[260px] bg-[#434343] ${
                  isModalOpen ? '' : 'z-30'
                }`}
              >
                <Image
                  src={propertyID.images[1]}
                  alt={'Property image'}
                  width={328}
                  height={260}
                  className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group"
                  onClick={openModal}
                />
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary">
                  Abrir galeria
                </span>
              </div>
              <div
                className={`max-w-[328px] max-h-[260px] bg-[#434343] rounded-tr-3xl ${
                  isModalOpen ? '' : 'z-30'
                }`}
              >
                <Image
                  src={propertyID.images[2]}
                  alt={'Property image'}
                  width={328}
                  height={260}
                  className="group cursor-pointer rounded-tr-3xl w-[328px] h-[260px] hover:opacity-25 group"
                  onClick={openModal}
                />
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary">
                  Abrir galeria
                </span>
              </div>

              <div
                className={`max-w-[328px] max-h-[260px] bg-[#434343] ${
                  isModalOpen ? '' : 'z-30'
                }`}
              >
                {!propertyID.images[3] ? (
                  <Image
                    src={'/images/logo-only-fonts.png'}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group"
                    onClick={openModal}
                  />
                ) : (
                  <Image
                    src={propertyID.images[3]}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group"
                    onClick={openModal}
                  />
                )}
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary">
                  Abrir galeria
                </span>
              </div>

              <div
                className={`max-w-[328px] max-h-[260px] bg-[#434343] ${
                  isModalOpen ? '' : 'z-30'
                }`}
              >
                {!propertyID.images[4] ? (
                  <Image
                    src={'/images/logo-only-fonts.png'}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group"
                    onClick={openModal}
                  />
                ) : (
                  <Image
                    src={propertyID.images[4]}
                    alt={'Property image'}
                    width={328}
                    height={260}
                    className="cursor-pointer w-[328px] h-[260px] hover:opacity-25 group"
                    onClick={openModal}
                  />
                )}
                <span className="hidden group-hover:relative group-hover:z-50 cursor-pointer relative top-[-150px] left-[80px] font-normal text-3xl text-tertiary">
                  Abrir galeria
                </span>
              </div>
            </div>
          </div>
          {modalIsOpen && (
            <GalleryModal setModalIsOpen={setModalIsOpen} props={propertyID} />
          )}
        </div>
      ) : (
        <div className="group relative h-[200px]">
          {/* Images */}
          <div className="flex flex-row w-full max-w-max overflow-hidden scroll-smooth h-[350px]">
            <Image
              src={propertyID.images[currentIndex]}
              key={currentIndex}
              alt={'Property Image'}
              width="405"
              height="350"
            />
          </div>
          {/* Index */}
          <div className="flex relative -top-8 left-[320px] w-9 rounded-lg bg-black opacity-50">
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
              onClick={nextImage}
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
        </div>
      )}
    </>
  );
};
export default Gallery;
