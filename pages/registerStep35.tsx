import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import store from 'store';
import { IPlan } from '../common/interfaces/plans/plans';
import CheckIcon from '../components/atoms/icons/checkIcon';
import Loading from '../components/atoms/loading';
import LinearStepper from '../components/atoms/stepper/stepper';
import PaymentBoard_Step3_5 from '../components/molecules/payment/paymentBoardStep3_5';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

interface IRegisterStep35 {
  plans: IPlan[];
}

const RegisterStep35: NextPageWithLayout<IRegisterStep35> = ({ plans }) => {
  const router = useRouter();
  const query = router.query;
  const urlEmail = query.email as string;
  const { progress, updateProgress } = useProgress();
  const storedData = store.get('propertyData');
  const [cardBrand, setCardBrand] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (storedData) {
        if (storedData.creditCard) {
          setCardBrand(storedData.creditCard.cardBrand);
        }
      }
    }
  }, [storedData]);

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
        <div className="lg:mx-24">
          <div className="md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 w-full mx-auto xl:mx-auto">
            <LinearStepper isSubmited={false} sharedActiveStep={3} />
          </div>

          {/**Confirmed payment */}
          <div className="bg-[#F7F7F6] border-4 border-[#4BB543] flex flex-row justify-between items-center p-7 md:p-14 min-h-[198px] my-8">
            <div className="flex flex-col p-4">
              <h1 className="text-[#4BB543] text-4xl font-bold mb-6">
                {!cardBrand || cardBrand === 'Free'
                  ? 'Imóvel Cadastrado!'
                  : 'Pagamento Confirmado!'}
              </h1>
              <p className="text-quaternary text-md md:text-2xl font-bold">
                {!cardBrand || cardBrand === 'Free'
                  ? 'Seu imóvel foi cadastrado e agora falta bem pouco para o seu anúncio estar no ar!'
                  : 'Seu pagamento foi confirmado e agora falta bem pouco para o seu anúncio estar no ar!'}
              </p>
            </div>
            <div className="rounde rounded-full bg-[#4BB543] w-20 h-20 flex items-center justify-center shrink-0">
              <CheckIcon fill="#F7F7F6" />
            </div>
          </div>

          <PaymentBoard_Step3_5 storedData={storedData} plans={plans} />

          {/**Button */}
          <div className="grid w-full px-5 lg:px-0 md:mx-0">
            <div className="flex md:justify-end justify-center md:mb-32 mt-16">
              <button
                className="active:bg-gray-500 cursor-pointer bg-primary w-full md:w-96 h-16 rounded transition-colors duration-300 hover:bg-red-600 hover:text-white"
                disabled={loading}
                onClick={() => {
                  updateProgress(5);
                  store.clearAll();
                  if (!urlEmail) {
                    router.push('/registerStep4');
                    setLoading(true);
                  } else {
                    setLoading(true);
                    router.push({
                      pathname: '/registerStep4',
                      query: {
                        email: urlEmail,
                      },
                    });
                  }
                }}
              >
                <span
                  className={`${
                    loading ? 'ml-16' : ''
                  }text-quinary font-bold text-3xl p-2`}
                >
                  Continuar
                  {loading && <Loading />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer smallPage={false} />
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
  };
}
