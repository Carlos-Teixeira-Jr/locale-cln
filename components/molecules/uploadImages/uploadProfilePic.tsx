/* eslint-disable @next/next/no-img-element */
import TrashIcon from '../../atoms/icons/trashIcon';

interface ImageProps {
  id: string;
  src: string;
  index: number;
  onRemove: (id: string) => void;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ id, src, onRemove, alt }) => {
  return (
    <div className="flex items-center">
      <img
        src={src}
        alt={alt}
        className="w-44 h-44 rounded-full mt-2 ml-10"
        height={176}
        width={176}
      />
      <div
        className="flex p-1 cursor-pointer bg-primary rounded-full ml-2"
        onClick={() => onRemove(id)}
      >
        <TrashIcon />
      </div>
    </div>
  );
};

export default Image;
