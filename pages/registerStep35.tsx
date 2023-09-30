import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LinearStepper from '../components/atoms/stepper/stepper';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { NextPageWithLayout } from './page';
import CheckIcon from '../components/atoms/icons/checkIcon';
import store from 'store';
import { IPlan } from '../common/interfaces/plans/plans';
import { useProgress } from '../context/registerProgress';
import PaymentBoard_Step3_5 from '../components/molecules/payment/paymentBoardStep3_5';


interface IRegisterStep35 {
  plans: IPlan[]
}

const RegisterStep35: NextPageWithLayout<IRegisterStep35> = ({
  plans,
}) => {
  const router = useRouter();
  const query = router.query;
  const urlEmail = query.email as string;
  const { progress, updateProgress } = useProgress();
  const storedData = store.get('propertyData');

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useEffect(() => {
    if (progress < 4) {
      router.push('/register');
    }
  });

  return (
    <>
      <div className="fixed z-10 top-0 w-auto md:w-full">
        <Header />
      </div>
      <div className="lg:mx-24">
        <div className="md:mt-36 mt-32 md:mb-14 lg:mb-2 w-full mx-auto lg:mx-24 max-w-[1536px] xl:mx-auto">
          <LinearStepper isSubmited={false} sharedActiveStep={3} />
        </div>

        {/**Confirmed payment */}
        <div className="bg-[#F7F7F6] border-4 border-[#4BB543] flex flex-row justify-between items-center p-7 md:p-14 min-h-[198px] my-8 md:my-16">
          <div className="flex flex-col p-4">
            <h1 className="text-[#4BB543] text-4xl font-bold mb-6">
              Pagamento Confirmado!
            </h1>
            <p className="text-quaternary text-md font-bold">
              Seu pagamento foi confirmado e agora falta bem pouco para o
              seu anúncio estar no ar!
            </p>
          </div>
          <div className='rounde rounded-full bg-[#4BB543] w-20 h-20 flex items-center justify-center shrink-0'>
            <CheckIcon
              fill='#F7F7F6'
            />
          </div>
        </div>
          
          <PaymentBoard_Step3_5 
            storedData={storedData}
            plans={plans}
          />

          {/**Button */}
        <div className="grid w-full">
          <div className="flex md:justify-end justify-center md:mb-32 mt-16 lg:mr-28">
            <button
              className="bg-primary w-96 h-16 rounded transition-colors duration-300 hover:bg-red-600 hover:text-white"
              onClick={() => {
                updateProgress(5);
                if (!urlEmail) {
                  router.push('/registerStep4');
                } else {
                  router.push({
                    pathname: '/registerStep4',
                    query: {
                      email: urlEmail
                    }
                  });
                }
              }}
            >
              <span className="text-quinary font-bold text-3xl p-2">
                Continuar
              </span>
            </button>
          </div>
        </div>
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep35;

export async function getStaticProps() {
  const plans = await fetch(`http://localhost:3001/plan`)
    .then((res) => res.json())
    .catch(() => ({}));

  return {
    props: {
      plans,
    },
  };
}
