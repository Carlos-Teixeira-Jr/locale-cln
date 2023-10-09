import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';

export interface IGalleryModal {
  setModalIsOpen: any;
  props: any;
}

const GalleryModal: React.FC<IGalleryModal> = ({ setModalIsOpen, props }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? props.images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextImage = () => {
    const isLastImage = currentIndex === props.images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="h-[95%] w-full -translate-y-[50%] top-1/2 py-20 mt-20 bg-black/90 absolute z-50 group inset-x-0">
      <div>
        <AiOutlineClose
          className="hidden group-hover:block absolute top-[4%] md:top-[5%] -translate-x-0 -translate-y-[50%] right-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
          size={50}
          onClick={() => setModalIsOpen(false)}
        />
      </div>
      <div
        style={{
          backgroundImage: `url(${props.images[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'contain',
        }}
        className="m-auto max-w-[1000px] h-full rounded-2xl bg-center bg-cover duration-500"
      ></div>
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
            {currentIndex + 1}/{props.images.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
