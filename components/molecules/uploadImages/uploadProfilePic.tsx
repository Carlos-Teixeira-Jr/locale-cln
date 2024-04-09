/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { defaultProfileImage } from '../../../common/utils/images/defaultImage/defaultImage';
import TrashIcon from '../../atoms/icons/trashIcon';

interface ImageProps {
  id: string;
  src: string;
  index: number;
  onImageChange: (id: string) => void;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ id, src, onImageChange, alt }) => {

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isDefault, setIsDefault] = useState(src ? false : true);

  useEffect(() => {
    if (imgRef.current) {
      setIsDefault(imgRef.current.src === defaultProfileImage);
    }
  }, [src, defaultProfileImage]);

  return (
    <div className="flex items-center">
      <img
        src={src ? src : defaultProfileImage}
        alt={alt}
        className={`rounded-full mt-2 ml-10 object-cover ${isDefault ?
          '' :
          'w-44 h-44'
          }`}
        height={176}
        width={176}
      />
      <div
        className="flex p-1 cursor-pointer bg-primary rounded-full ml-2 transition-colors duration-300 hover:bg-red-600"
        onClick={() => onImageChange(id)}
      >
        <TrashIcon />
      </div>
    </div>
  );
};

export default Image;
