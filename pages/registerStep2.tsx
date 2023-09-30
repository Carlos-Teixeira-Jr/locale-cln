import { useRouter } from 'next/router';
import { useState } from 'react';
import LinearStepper from '../components/atoms/stepper/stepper';
import UploadImages from '../components/molecules/uploadImages/uploadImages';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import PropertyDifferentials from '../components/organisms/register/propertyDifferential';
import { NextPageWithLayout } from './page';

enum SelectOption {
  condominio = 'condominio',
  normal = 'normal',
}

const RegisterStep2: NextPageWithLayout = () => {
  const router = useRouter();
  const option = router.query.option as SelectOption;
  const [sharedImagesArray, setSharedImagesArray] = useState();
  const [minimunImagesUpload, setMinimunImagesUpload] = useState(false);

  return (
    <div className="items-center flex flex-col">
      <div className="fixed z-10 top-0 md:w-full">
        <Header />
      </div>

      <div className="mt-26 mb-2 max-w-[1232px] justify-center">
        <LinearStepper isSubmited={false} sharedActiveStep={1} />
      </div>

      <div className="md:mx-auto max-w-[1232px]" id="upload-images">
        <UploadImages editarImages={[]} />
        {minimunImagesUpload && (
          <span className="text-red-500 flex justify-center">
            Você precisa enviar ao menos 3 fotos para avançar!
          </span>
        )}
      </div>

      <div className="mb-[150px] mx-2 max-w-[1232px] justify-center">
        <PropertyDifferentials
          shouldRenderCondDiv={option === SelectOption.condominio}
          sharedImagesArray={sharedImagesArray}
          setMinimunImagesUpload={setMinimunImagesUpload}
          id={'upload-images'}
        />
      </div>

      <Footer smallPage={false} />
    </div>
  );
};

export default RegisterStep2;
