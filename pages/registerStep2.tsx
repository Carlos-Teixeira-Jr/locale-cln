import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import store from 'store';
import LinearStepper from '../components/atoms/stepper/stepper';
import UploadImages from '../components/molecules/uploadImages/uploadImages';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import PropertyDifferentials from '../components/organisms/register/propertyDifferential';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

const RegisterStep2: NextPageWithLayout = () => {
  const imagesInputRef = useRef<HTMLElement>(null);

  const router = useRouter();
  const query = router.query;
  const urlEmail = query.email;
  const { progress, updateProgress } = useProgress();
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [condominiumTags, setCondominiumTags] = useState<string[]>([]);
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const storedData = store.get('propertyData');
  const isCondominium = storedData?.condominium ? true : false;

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useEffect(() => {
    if (progress < 2) {
      router.push('/register');
    }
  });

  // Envia as mensagens de erros para o componente UploadImages;
  const [errorInfo, setErrorInfo] = useState({
    error: '',
    prop: '',
  });

  // Lida com a verificação de erros do handleSubmit (necessário para acessar o valor atualizado de erros ainda antes do final da execução do handleSubmit)
  const errorHandler = useRef<{ error: string; prop: string }>({
    error: '',
    prop: '',
  });

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const imagesError = `Você precisa adicionar pelo menos mais ${
      3 - images.length
    } ${3 - images.length === 1 ? 'foto' : 'fotos'}.`;

    setErrorInfo({
      prop: '',
      error: '',
    });

    errorHandler.current = {
      prop: '',
      error: '',
    };

    if (images.length < 3) {
      setErrorInfo({ error: imagesError, prop: 'images' });
      errorHandler.current = { error: imagesError, prop: 'images' };
    }

    if (errorHandler.current.prop === '' && errorHandler.current.error === '') {
      const existingData = store.get('propertyData');
      if (existingData) {
        existingData.images = images;
        existingData.tags = tags;
        existingData.condominiumTags = condominiumTags;
        existingData.youtubeLink = youtubeLink;
      }

      toast.loading('Enviando...');
      store.set('propertyData', existingData);
      toast.dismiss();
      updateProgress(3);
      router.push({
        pathname: '/registerStep3',
        query: {
          email: urlEmail,
        },
      });
    } else {
      toast.error(
        `Algum campo obrigatório ${errorInfo.prop} não foi preenchido.`
      );
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col mx-auto max-w-[1215px]">
        <div className="md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 w-full mx-auto xl:mx-auto">
          <LinearStepper isSubmited={false} sharedActiveStep={1} />
        </div>
        <div className="max-w-[1232px]" id="upload-images">
          <UploadImages
            onImagesUpdate={(updatedImages: string[]) =>
              setImages(updatedImages)
            }
            onErrorsInfo={errorInfo}
            imagesInputRef={imagesInputRef}
          />
        </div>

        <div className="mb-10 mx-2 max-w-[1232px] justify-center">
          <PropertyDifferentials
            shouldRenderCondDiv={isCondominium}
            isEdit={false}
            onTagsUpdate={(updatedTags: string[]) => setTags(updatedTags)}
            onCondominiumTagsUpdate={(updatedCondTags: string[]) =>
              setCondominiumTags(updatedCondTags)
            }
            onVideoLinkUpdate={(updatedVideo: string) =>
              setYoutubeLink(updatedVideo)
            }
          />
        </div>

        <div className="flex self-end md:justify-end justify-center md:mb-32 mx-auto sm:mx-10 max-w-[1232px]">
          <button
            className="bg-primary w-80 h-16 text-tertiary rounded transition-colors duration-300 font-bold text-2xl lg:text-3xl hover:bg-red-600 hover:text-white"
            onClick={handleSubmit}
          >
            Continuar
          </button>
        </div>
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep2;
