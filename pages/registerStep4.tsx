import { useRouter } from 'next/router';
import { useState } from 'react';
import useProgressRedirect from '../common/utils/stepProgressHandler';
import Loading from '../components/atoms/loading';
import LinearStepper from '../components/atoms/stepper/stepper';
import { Footer, Header } from '../components/organisms';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

const RegisterStep4: NextPageWithLayout = () => {
  const router = useRouter();
  const { progress } = useProgress();
  const [loading, setLoading] = useState(false);

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useProgressRedirect(progress, 5, '/register');

  const handleSubmit = () => {
    setLoading(true);
    router.push('/login');
  };

  const classes = {
    root: 'flex flex-col mx-auto max-w-[1215px]',
    stepLabel:
      'md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 w-full mx-auto xl:mx-auto',
    body: 'md:mx-20 md:mb-20 flex flex-col justify-center mx-auto',
    textContainer: 'flex flex-col m-5 md:w-2/3 mx-auto',
    h1: 'text-3xl text-red-500 text-center font-bold mb-5',
    p: 'font-medium text-lg lg:text-xl text-quaternary inline-block mx-5',
    buttonContainer: 'flex justify-center items-center my-4 max-w-[1215px]',
    button:
      `flex items-center flex-row justify-around w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl ${loading ?
        'bg-red-300 transition-colors duration-300' :
        'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
      }`
  };

  return (
    <>
      {progress !== 5 ? (
        <div className='flex justify-center items-center h-screen'>
          <Loading className='md:w-20 w-10 h-10 md:h-20 animate-spin text-gray-200 dark:text-gray-600 fill-tertiary' fill={'#F75D5F'} />
        </div>
      ) : (
        <>
          <Header />
          <div className={classes.root}>
            <div className={classes.stepLabel}>
              <LinearStepper activeStep={3} />
            </div>

            <div className={classes.body}>
              <div className={classes.textContainer}>
                <h1 className={classes.h1}>Parabéns!!</h1>
                <p className={classes.p}>
                  O anúncio do seu imóvel está pronto e seu cadastro quase
                  finalizado! A senha da sua conta foi enviada para o seu e-mail.
                </p>

                <div className={classes.buttonContainer}>
                  <button
                    className={classes.button}
                    disabled={loading}
                    onClick={() => handleSubmit()}
                  >
                    <span className={`${loading ? 'ml-5' : ''}`}>Acessar</span>
                    {loading && <Loading />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default RegisterStep4;
