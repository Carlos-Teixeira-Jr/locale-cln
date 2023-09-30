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

  const images = [
    'https://a0.muscache.com/im/pictures/miso/Hosting-762143343639225867/original/099d0c6a-0cbb-4a3a-8501-a08bf202ae60.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/miso/Hosting-762143343639225867/original/1d5d5772-cfa8-486f-b5a9-205665d06464.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/miso/Hosting-762143343639225867/original/6e22d808-0f4a-4d50-967f-858a696aaac5.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/miso/Hosting-762143343639225867/original/c4ca0ee7-8928-4a5f-b799-3834166416f1.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/miso/Hosting-762143343639225867/original/32dbd4d3-9166-429f-96d4-e10d015f7586.jpeg?im_w=1200',
  ];

  return (
    <div className="h-full w-full -translate-y-[50%] top-[50%] py-20 mt-1.5 bg-black/90 items-center absolute z-50 group inset-x-0">
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
        className="m-auto max-w-[1200px] h-full rounded-2xl bg-center bg-cover duration-500"
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
