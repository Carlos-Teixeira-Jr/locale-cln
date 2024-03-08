import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import store from 'store';
import { clearIndexDB } from '../common/utils/indexDb';
import useProgressRedirect from '../common/utils/stepProgressHandler';
import Loading from '../components/atoms/loading';
import LinearStepper from '../components/atoms/stepper/stepper';
import UploadImages from '../components/molecules/uploadImages/uploadImages';
import { Footer, Header } from '../components/organisms';
import PropertyDifferentials from '../components/organisms/register/propertyDifferential';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

const RegisterStep2: NextPageWithLayout = () => {
  const imagesInputRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const { progress, updateProgress } = useProgress();
  const [loading, setLoading] = useState(false);
  const query = router.query;
  const urlEmail = query.email;
  const [images, setImages] = useState<string[]>([]);
  const [condominiumTags, setCondominiumTags] = useState<string[]>([]);
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const storedData = store.get('propertyData');
  const [tags, setTags] = useState<string[]>([]);
  const isCondominium = storedData?.condominium ? true : false;

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useProgressRedirect(progress, 2, '/register');

  useEffect(() => {
    clearIndexDB();
  }, []);

  const [errorInfo, setErrorInfo] = useState({
    error: '',
    prop: '',
  });

  const errorHandler = useRef<{ error: string; prop: string }>({
    error: '',
    prop: '',
  });

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    const imagesError = `Você precisa adicionar pelo menos mais ${
      5 - images.length
    } ${5 - images.length === 1 ? 'foto' : 'fotos'}.`;

    setErrorInfo({
      prop: '',
      error: '',
    });

    errorHandler.current = {
      prop: '',
      error: '',
    };

    if (images.length < 5) {
      setErrorInfo({ error: imagesError, prop: 'images' });
      errorHandler.current = { error: imagesError, prop: 'images' };
      setLoading(false);
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
      setLoading(true);
      store.set('propertyData', existingData);
      toast.dismiss();
      updateProgress(3);
      if (urlEmail !== undefined) {
        router.push({
          pathname: '/registerStep3',
          query: {
            email: urlEmail,
          },
        });
      } else {
        router.push('/registerStep3');
      }
    } else {
      toast.error(
        `Algum campo obrigatório ${errorInfo.prop} não foi preenchido.`
      );
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    updateProgress(1);
    router.back();
  };

  return (
    <>
      <Header />
      <div className={classes.body}>
        <div className={classes.stepLabel}>
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

        <div className={classes.propertyDifferentials}>
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

        <div className={classes.buttonContainer}>
          <button className={classes.button} onClick={handlePreviousStep}>
            Voltar
          </button>
          <button
            className={classes.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            <span className={`${loading ? 'ml-5' : ''}`}>Continuar</span>
            {loading && <Loading />}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterStep2;

const classes = {
  body: 'flex flex-col mx-auto max-w-[1215px]',
  propertyDifferentials: 'mb-10 mx-2 max-w-[1232px] justify-center',
  buttonContainer:
    'flex flex-col md:flex-row lg:flex-row xl:flex-row gap-4 md:gap-0 lg:gap-0 xl:gap-0 items-center justify-between my-4 max-w-[1215px]',
  button:
    'active:bg-gray-500 cursor-pointer flex items-center flex-row justify-around bg-primary w-44 h-14 text-tertiary rounded transition-colors duration-300 font-bold text-lg md:text-xl hover:bg-red-600 hover:text-white',
  stepLabel:
    'md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 w-full mx-auto xl:mx-auto',
};
