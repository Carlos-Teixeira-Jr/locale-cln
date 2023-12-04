import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loading from '../components/atoms/loading';
import LinearStepper from '../components/atoms/stepper/stepper';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

const RegisterStep4: NextPageWithLayout = () => {
  const router = useRouter();
  const { progress, updateProgress } = useProgress();
  const [loading, setLoading] = useState(false);

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useEffect(() => {
    if (progress < 4) {
      router.push('/register');
    }
  });

  const handleSubmit = () => {
    router.push('/login');
    setLoading(true);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col mx-auto max-w-[1215px]">
        <div className="md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 w-full mx-auto xl:mx-auto">
          <LinearStepper isSubmited={false} sharedActiveStep={3} />
        </div>

        <div className="md:mx-20 md:mb-20 flex flex-col justify-center mx-auto">
          <div className="flex flex-col m-5 md:w-2/3 mx-auto">
            <h1 className="text-4xl text-red-500 text-center font-bold mb-5">
              Parabéns!!
            </h1>
            <p className="font-medium text-lg lg:text-2xl text-quaternary inline-block mx-5">
              O anúncio do seu imóvel está pronto e seu cadastro quase
              finalizado! A senha da sua conta foi enviada para o seu e-mail.
            </p>

            <div className="flex justify-center items-center my-4 max-w-[1215px]">
              <button
                className="active:bg-gray-500 cursor-pointer flex items-center gap-2 flex-row justify-around bg-primary w-80 h-16 text-tertiary rounded transition-colors duration-300 font-bold text-2xl lg:text-3xl hover:bg-red-600 hover:text-white"
                disabled={loading}
                onClick={() => handleSubmit()}
              >
                <span className={`${loading ? 'ml-20' : ''}`}>Acessar</span>
                {loading && <Loading />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep4;
