/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import {
  addImageToDB,
  getAllImagesFromDB,
  removeImageFromDB,
} from '../../../common/utils/indexDb';
import { ErrorToastNames, showErrorToast } from '../../../common/utils/toasts';
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

  useEffect(() => {
    const loadImagesFromDB = async () => {
      try {
        // Consulta o IndexedDB para recuperar as imagens salvas
        const imagesFromDB = await getAllImagesFromDB();
        // Define o estado `images` com as imagens recuperadas
        setImages(imagesFromDB as any[]);
      } catch (error) {
        showErrorToast(ErrorToastNames.LoadImages);
      }
    };
    // Chama a função para carregar imagens do IndexedDB quando o componente é montado
    loadImagesFromDB();
  }, []);

  const handleAddImage = async (event: any) => {
    const files = event.target.files;

    if (files.length + images.length > 50) {
      showErrorToast(ErrorToastNames.ImagesMaxLimit);
      return;
    }

    for (const file of files) {
      const id = uuidv4();
      const src = URL.createObjectURL(file);

      // Adiciona a imagem ao IndexedDB junto com o ID UUID
      await addImageToDB(file, src, id);

      setImages((prevImages) => [...prevImages, { src, id }]);
    }
  };

  const handleRemoveImage = async (id: string) => {
    try {
      const foundId = images.find((image) => image.id === id);

      if (foundId === undefined) {
        console.error('Imagem não encontrada com o ID:', id);
        return;
      }

      await removeImageFromDB(id);

      setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    } catch (error) {
      console.error('Erro ao remover a imagem:', error);
    }
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
      className="max-w-full block mx-5 flex-column items-center justify-center lg:mx-auto"
      ref={imagesErrorScroll}
    >
      <label
        className="flex flex-row justify-center items-center px-5 w-64 h-12 border rounded-[50px] bg-secondary cursor-pointer mt-4 mx-auto"
        htmlFor="uploadImages"
      >
        <CameraIcon />
        <span className="font-bold text-quinary text-lg text-center">
          Adicionar Fotos
        </span>
      </label>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webm"
        multiple
        onChange={handleAddImage}
        className="hidden mb-4"
        id="uploadImages"
        max={7}
      />
      <p
        className={`text-quaternary font-medium text-xs mt-1 mb-2 flex ${
          images.length === 0 ? 'hidden' : ''
        }`}
      >
        Adicione ao menos 5 fotos para publicar o imóvel{' '}
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
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            style={
              onErrorsInfo?.prop === 'images' ? { border: '1px solid red' } : {}
            }
          >
            {images.map((image, index) => (
              <Image
                key={image.id ? image.id : `${image}-${index}`}
                id={image.id}
                src={image.src ? image.src : images[index].src}
                index={index}
                onRemove={() => handleRemoveImage(image.id)}
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

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

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
        className="w-24 h-16 md:w-full md:h-36 lg:h-52 object-cover rounded"
      />
      <div
        className="absolute top-0 right-0 p-2 cursor-pointer"
        onClick={() => onRemove(id)}
      >
        <TrashIcon />
      </div>
      <span className="absolute bottom-0 left-0 p-1 px-3 text-sm text-white bg-black bg-opacity-50 rounded-3xl">
        {index === 0 ? 'Capa do anúncio' : index + 1}
      </span>
    </div>
  );
};

export default UploadImages;
