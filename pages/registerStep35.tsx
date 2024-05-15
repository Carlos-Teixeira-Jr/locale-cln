import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import store from 'store';
import { IPlan } from '../common/interfaces/plans/plans';
import useProgressRedirect from '../common/utils/stepProgressHandler';
import CheckIcon from '../components/atoms/icons/checkIcon';
import Loading from '../components/atoms/loading';
import LinearStepper from '../components/atoms/stepper/stepper';
import PaymentBoard_Step3_5 from '../components/molecules/payment/paymentBoardStep3_5';
import { Footer, Header } from '../components/organisms';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

interface IRegisterStep35 {
  plans: IPlan[];
}

// To-do: Se não for feita uma nova compra não deve mostrar o valor;
// To-do: informar sobre status do plano dio usuário;


const RegisterStep35: NextPageWithLayout<IRegisterStep35> = ({ plans }) => {
  const router = useRouter();
  const { progress, updateProgress } = useProgress();
  const [cardBrand, setCardBrand] = useState('');
  const [loading, setLoading] = useState(false);
  const query = router.query;
  const urlEmail = query.email as string;
  const storedData = store.get('propertyData');
  const [couponWasUsed, setCouponWasUsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (storedData) {
        if (storedData?.paymentData?.cardBrand) {
          setCardBrand(storedData?.creditCard?.cardBrand);
        }
        if (storedData?.paymentData?.couponUsed) {
          setCouponWasUsed(true);
        }
      }
    }
  }, [storedData]);

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useProgressRedirect(progress, 4, '/register');

  const handleSubmit = () => {
    setLoading(true);
    updateProgress(5);
    store.clearAll();
    localStorage.setItem('locale.cookiesPolicy', 'true');
    if (!urlEmail) {
      router.push('/registerStep4');
    } else {
      router.push({
        pathname: '/registerStep4',
        query: {
          email: urlEmail,
        },
      });
    }
  };

  return (
    <>
      {progress !== 4 ? (
        <div className='flex justify-center items-center h-screen'>
          <Loading className='md:w-20 w-10 h-10 md:h-20 animate-spin text-gray-200 dark:text-gray-600 fill-tertiary' fill={'#F75D5F'} />
        </div>
      ) : (
        <>
          <Header />
          <div className={classes.body}>
            <div className="lg:mx-24">
              <div className={classes.stepLabel}>
                <LinearStepper activeStep={3} />
              </div>

              <div className={classes.card}>
                <div className="flex flex-col p-4">
                  <h1 className={classes.h1}>
                    {!cardBrand || cardBrand === 'Free' || couponWasUsed
                      ? 'Imóvel Cadastrado!'
                      : 'Pagamento Confirmado!'}
                  </h1>
                  <p className={classes.p}>
                    {!cardBrand || cardBrand === 'Free' || couponWasUsed
                      ? 'Seu imóvel foi cadastrado e agora falta bem pouco para o seu anúncio estar no ar!'
                      : 'Seu pagamento foi confirmado e agora falta bem pouco para o seu anúncio estar no ar!'}
                  </p>
                </div>
                <div className={classes.checkIcon}>
                  <CheckIcon fill="#F7F7F6" />
                </div>
              </div>

              <PaymentBoard_Step3_5 storedData={storedData} plans={plans} />

              <div className={classes.buttonContainer}>
                <button
                  className={classes.button}
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  <span className={`${loading ? 'ml-5' : ''}`}>Continuar</span>
                  {loading && <Loading />}
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default RegisterStep35;

export async function getStaticProps() {
  const plans = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan`)
    .then((res) => res.json())
    .catch(() => ({}));

  return {
    props: {
      plans,
    },
    revalidate: 60,
  };
}

const classes = {
  body: 'flex flex-col mx-auto max-w-[1215px]',
  stepLabel:
    'md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 w-full mx-auto xl:mx-auto',
  card: 'bg-[#F7F7F6] border-4 border-[#4BB543] flex flex-row justify-between items-center p-5 md:p-7 md:p-14 min-h-[198px] my-8 mx-2',
  h1: 'text-[#4BB543] text-xl md:text-2xl font-bold mb-6',
  p: 'text-quaternary text-sm md:text-xl font-bold',
  buttonContainer:
    'flex md:justify-end justify-center lg:justify-end xl:justify-end my-4 max-w-[1215px]',
  button:
    'active:bg-gray-500 cursor-pointer flex items-center flex-row justify-around bg-primary w-44 h-14 text-tertiary rounded transition-colors duration-300 font-bold text-lg md:text-xl hover:bg-red-600 hover:text-white',
  checkIcon:
    'rounded-full bg-[#4BB543] md:w-20 md:h-20 flex items-center justify-center shrink-0',
};
