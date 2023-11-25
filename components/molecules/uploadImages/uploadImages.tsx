/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import CameraIcon from '../../atoms/icons/cameraIcon';
import TrashIcon from '../../atoms/icons/trashIcon';

interface IImages {
  editarImages?: string[];
  onImagesUpdate?: (updatedImages: string[]) => void;
  onErrorsInfo?: OnErrorInfo;
  imagesInputRef?: any;
}

export type OnErrorInfo = {
  prop: string;
  error: string;
};

const UploadImages = ({
  editarImages,
  onImagesUpdate,
  onErrorsInfo,
  imagesInputRef,
}: IImages) => {
  const imagesErrorScroll = useRef(imagesInputRef);

  const [images, setImages] = useState<any[]>(editarImages || []);

  const [error, setError] = useState<OnErrorInfo>({
    prop: '',
    error: '',
  });

  useEffect(() => {
    if (error.error !== '') {
      imagesErrorScroll.current.scrollIntoView({
        behavior: 'auto',
        block: 'center',
      });
    }
  }, [error]);

  useEffect(() => {
    if (onErrorsInfo?.prop === 'images') {
      setError(onErrorsInfo!);
    }
  }, [error, onErrorsInfo]);

  useEffect(() => {
    onImagesUpdate!(images.map((image) => image.src));
  }, [images]);

  useEffect(() => {
    if (editarImages) {
      setImages(editarImages.map((src) => ({ src, id: uuidv4() })));
    }
  }, [editarImages]);

  const handleAddImage = (event: any) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 20) {
      alert('Você pode adicionar no máximo 20 imagens');
      return;
    }

    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [
          ...prevImages,
          { src: reader.result, id: uuidv4() },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const dragImage = images[dragIndex];
    const newImages = [...images];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, dragImage);
    setImages(newImages);
  };

  return (
    <div
      className="max-w-screen-md block mx-5 flex-column items-center justify-center lg:mx-auto"
      ref={imagesErrorScroll}
    >
      <label
        className="flex flex-row items-center px-6 w-64 h-12 border rounded-[50px] bg-secondary cursor-pointer mt-4 mx-auto"
        htmlFor="uploadImages"
      >
        <CameraIcon />
        <span className="font-bold text-quinary text-2xl">Adicionar Fotos</span>
      </label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webm"
        multiple
        onChange={handleAddImage}
        className="hidden mb-4"
        id="uploadImages"
      />
      <p
        className={`text-quaternary font-medium text-xs mt-1 mb-2 flex ${
          images.length === 0 ? 'hidden' : ''
        }`}
      >
        Adicione ao menos 3 fotos para publicar o imóvel{' '}
      </p>
      <div
        className={`flex flex-col justify-center sm:max-w-7xl min-h-max bg-[#F7F7F6] border border-secondary gap-10 p-3 m-1 ${
          images.length === 0 ? 'hidden' : ''
        }`}
        style={
          onErrorsInfo?.prop === 'images' ? { border: '1px solid red' } : {}
        }
      >
        <DndProvider backend={HTML5Backend}>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            style={
              onErrorsInfo?.prop === 'images' ? { border: '1px solid red' } : {}
            }
          >
            {images.map((image, index) => (
              <Image
                key={image.id ? image.id : `${image}-${index}`}
                id={image.id}
                src={image.src}
                index={index}
                onRemove={handleRemoveImage}
                moveImage={moveImage}
              />
            ))}
          </div>
        </DndProvider>
      </div>
      {error.prop === 'images' && (
        <span className="text-red-500 text-xs flex justify-center">
          {error.error}
        </span>
      )}
      <p
        className={`text-quaternary text-sm font-medium mt-2 text-justify p-2 md:p-0 ${
          images.length === 0 ? 'hidden' : ''
        }`}
      >
        Você pode arrastar as imagens dentro da caixa para mudar a ordem de
        exibição. A primeira imagem será a capa do anúncio.
      </p>
    </div>
  );
};

interface ImageProps {
  id: string;
  src: string;
  index: number;
  onRemove: (id: string) => void;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
}

const Image: React.FC<ImageProps> = ({
  id,
  src,
  index,
  onRemove,
  moveImage,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'image',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop({
    accept: 'image',
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset: any = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Arrastando para baixo
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Arrastando para cima
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const draggingStyle = isDragging
    ? {
        backgroundColor: 'rgba(211, 211, 211, 1)',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
      }
    : {};

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="relative bg-gray-100 p-2 border border-gray-300 rounded"
      style={draggingStyle}
    >
      <img
        ref={(node) => {
          drag(node);
          preview(node);
        }}
        src={src}
        alt=""
        className="w-full h-48 object-cover rounded"
      />
      <div
        className="absolute top-0 right-0 p-2 cursor-pointer"
        onClick={() => onRemove(id)}
      >
        <TrashIcon />
      </div>
      <span className="absolute bottom-0 left-0 p-1 px-3 text-white bg-black bg-opacity-50 rounded-3xl">
        {index === 0 ? 'Capa do anúncio' : index + 1}
      </span>
    </div>
  );
};

export default UploadImages;
