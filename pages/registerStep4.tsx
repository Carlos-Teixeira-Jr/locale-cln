import LocaleLogo from '../components/atoms/logos/locale';
import LinearStepper from '../components/atoms/stepper/stepper';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import PasswordForm from '../components/organisms/register/passwordForm';
import { NextPageWithLayout } from './page';

const RegisterStep4: NextPageWithLayout = () => {
  return (
    <>
      <div className="fixed z-10 top-0 md:w-full">
        <Header />
      </div>
      <div className="flex items-center justify-center max-w-[1232px]">
        <div className="flex flex-col justify-center max-w-[1232px]">
          <div className="mt-36 mb-2">
            <LinearStepper sharedActiveStep={4} />
          </div>

          <div className="md:mx-20 md:mb-20 flex flex-col justify-center mx-auto">
            <div className="flex flex-col justify-center m-5">
              <h1 className="md:text-6xl text-4xl text-red-500 font-bold leading-[75px] mb-5">
                Parabéns!!
              </h1>
              <p className="font-medium md:text-3xl text-xl md:leading-10 text-quaternary inline-block">
                O anúncio do seu imóvel está pronto e seu cadastro quase
                finalizado! Falta apenas cadastrar a sua senha para fazer login
                na <LocaleLogo className="md:inline-block mx-auto" />
              </p>
            </div>

            <PasswordForm />
          </div>
        </div>
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep4;
