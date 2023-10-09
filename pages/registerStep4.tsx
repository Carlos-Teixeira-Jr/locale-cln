import LinearStepper from '../components/atoms/stepper/stepper';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { NextPageWithLayout } from './page';
import { useRouter } from 'next/router';

const RegisterStep4: NextPageWithLayout = () => {

  const router = useRouter();

  return (
    <>
      <div className="fixed z-10 top-0 w-auto md:w-full">
        <Header />
      </div>
      <div className="lg:mx-24">
        <div className="md:mt-36 mt-32 md:mb-14 lg:mb-2 w-full mx-auto lg:mx-24 max-w-[1536px] xl:mx-auto">
          <LinearStepper isSubmited={false} sharedActiveStep={3} />
        </div>

        <div className="md:mx-20 md:mb-20 flex flex-col justify-center mx-auto">
          <div className="flex flex-col m-5">
            <h1 className="text-4xl text-red-500 text-center font-bold mb-5">
              Parabéns!!
            </h1>
            <p className="font-medium text-lg text-quaternary inline-block">
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