import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MouseEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import useProgressRedirect from '../common/utils/stepProgressHandler';
import { ErrorToastNames, showErrorToast } from '../common/utils/toasts';
import Loading from '../components/atoms/loading';
import LinearStepper from '../components/atoms/stepper/stepper';
import UploadImages from '../components/molecules/uploadImages/uploadImages';
import { Footer, Header } from '../components/organisms';
import PropertyDifferentials from '../components/organisms/register/propertyDifferential';
import { useProgress } from '../context/registerProgress';
var store = require('store')

interface IRegisterStep2 {
  ownerProperties: IOwnerProperties
}

const defaultOwnerProperties: IOwnerProperties = {
  docs: [],
  count: 0,
  totalPages: 0,
  messages: []
};

const RegisterStep2 = ({ ownerProperties = defaultOwnerProperties }: IRegisterStep2) => {
  const isOwner = ownerProperties?.docs.length > 0;
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

    const imagesError = `Você precisa adicionar pelo menos mais ${5 - images.length
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
      showErrorToast(ErrorToastNames.EmptyFields)
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    updateProgress(1);
    router.back();
  };

  const classes = {
    body: 'flex flex-col mx-auto max-w-[1215px]',
    propertyDifferentials: 'mb-10 mx-2 max-w-[1232px] justify-center',
    buttonContainer:
      'flex flex-col-reverse md:flex-row lg:flex-row xl:flex-row gap-4 md:gap-0 lg:gap-0 xl:gap-0 items-center justify-between my-4 max-w-[1215px]',
    button:
      `flex items-center flex-row justify-around w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl transition-colors duration-300 ${loading ?
        'bg-red-300' :
        'bg-primary hover:bg-red-600 hover:text-white cursor-pointer'
      }`,
    stepLabel:
      'md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 w-full mx-auto xl:mx-auto',
  };

  return (
    <>
      {progress !== 2 ? (
        <div className='flex justify-center items-center h-screen'>
          <Loading className='md:w-20 w-10 h-10 md:h-20 animate-spin text-gray-200 dark:text-gray-600 fill-tertiary' fill={'#F75D5F'} />
        </div>
      ) : (
        <>
          <Header userIsOwner={isOwner} />
          <div className={classes.body}>
            <div className={classes.stepLabel}>
              <LinearStepper activeStep={1} />
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
      )}
    </>
  );
};

export default RegisterStep2;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = 1;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let ownerData;
  let ownerProperties = defaultOwnerProperties;

  try {
    const ownerIdResponse = await fetch(
      `${baseUrl}/user/find-owner-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (ownerIdResponse.ok) {
      const response = await ownerIdResponse.json();
      if (response?.owner?._id) {
        ownerData = response;

        ownerProperties = await fetch(`${baseUrl}/property/owner-properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId: ownerData?.owner?._id,
            page,
          }),
        })
          .then((res) => res.json())
          .catch(() => defaultOwnerProperties)
      } else {
        ownerProperties = defaultOwnerProperties;
      }
    } else {
      ownerData = {};
    }
  } catch (error) {
    console.error(`Error:`, error)
  }

  return {
    props: {
      ownerProperties: ownerProperties ?? defaultOwnerProperties
    },
  };
}
