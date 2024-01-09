/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import CameraIcon from '../../atoms/icons/cameraIcon';
import TrashIcon from '../../atoms/icons/trashIcon';

interface IImages {
  editarImages?: string;
  onImagesUpdate: (updatedImages: string) => void;
}

const UploadProfilePicture = ({ editarImages, onImagesUpdate }: IImages) => {
  const [images, setImages] = useState<any>(editarImages || '');

  useEffect(() => {
    onImagesUpdate(images);
  }, [images, onImagesUpdate]);

  useEffect(() => {
    if (editarImages) {
      setImages(editarImages);
    }
  }, [editarImages]);

  const handleAddImage = (event: any) => {
    const files = event.target.files;

    if (files.length === 0) {
      return;
    }

    if (files.length > 1 || images) {
      alert('Você só pode adicionar uma imagem');
      return;
    }

    const file = files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImages(null);

    const fileInput = document.getElementById(
      'uploadImages'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="flex flex-col justify-center items-end">
      <h1 className="text-xl font-normal text-quaternary leading-7">
        Adicionar foto de perfil (Opcional)
      </h1>
      <div className="flex items-center">
        {images && (
          <Image
            key={images.id ? images.id : `${images}`}
            id={images.id}
            src={images}
            index={0}
            onRemove={handleRemoveImage}
            alt={'Foto de perfil'}
          />
        )}
      </div>
      <label
        className="flex flex-row items-center px-6 w-64 h-12 border rounded-[50px] bg-secondary cursor-pointer mt-4 "
        htmlFor="uploadImages"
      >
        <CameraIcon />
        <span className="font-bold text-quinary text-2xl">Adicionar foto</span>
      </label>
      <div className="hidden">
        {' '}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webm"
          multiple={false}
          onChange={handleAddImage}
          style={{ display: 'hidden' }}
          id="uploadImages"
          title=""
        />
      </div>
    </div>
  );
};

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
