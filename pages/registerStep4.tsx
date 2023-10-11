import { useEffect } from 'react';
import LinearStepper from '../components/atoms/stepper/stepper';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { NextPageWithLayout } from './page';
import { useRouter } from 'next/router';
import { useProgress } from '../context/registerProgress';

const RegisterStep4: NextPageWithLayout = () => {

  const router = useRouter();
  const { progress, updateProgress } = useProgress();

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useEffect(() => {
    if (progress < 4) {
      router.push('/register');
    }
  });

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

            <button className="w-2/3 mx-auto transition-colors duration-300 hover:bg-red-600 hover:text-white bg-primary text-tertiary rounded-[10px] md:text-3xl text-2xl leading-10 py-5 font-extrabold my-10" onClick={() => router.push('/login')}>Acessar</button>
          </div>

        </div>
      </div>
      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep4;