import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CheckedIcon from '../components/atoms/icons/checkedIcon';
import MastercardIcon from '../components/atoms/icons/mastercard';
import VisaIcon from '../components/atoms/icons/visaIcon';
import LinearStepper from '../components/atoms/stepper/stepper';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { NextPageWithLayout } from './page';

interface IRegisterStep35 {
  mastercard: boolean;
  visa: boolean;
  value: string;
  total: string;
  installments?: number;
  plan: string;
}

const RegisterStep35: NextPageWithLayout<IRegisterStep35> = ({
  mastercard,
  visa,
  value,
  total,
  installments,
  plan,
}) => {
  const router = useRouter();
  const cardFlag = router.query.cardFlag;
  const planQuery = router.query.plan;
  const [selectedPlan, setSelectedPlan] = useState({
    plan: '',
    value: '',
  });

  useEffect(() => {
    if (planQuery === 'free') {
      setSelectedPlan({ ...selectedPlan, plan: 'FREE', value: '0,00' });
    }
    if (planQuery === 'basico') {
      setSelectedPlan({ ...selectedPlan, plan: 'BÁSICO', value: '20,00' });
    }
    if (planQuery === 'plus') {
      setSelectedPlan({ ...selectedPlan, plan: 'PLUS', value: '50,00' });
    }
  }, [planQuery]);

  const handleContinueBtn = () => {
    router.push('/register-step-4');
  };

  return (
    <>
      <div className="fixed z-10 top-0 w-full">
        <Header />
      </div>
      <div className="flex justify-center max-w-[1232px]">
        <div className="flex flex-col justify-center max-w-[1232px]">
          <div className="mt-36 mb-2">
            <LinearStepper isSubmited={false} sharedActiveStep={3} />
          </div>

          <div className="flex flex-col max-w-[1232px] items-center justify-center">
            {/**Confirmed payment */}
            <div className="bg-[#F7F7F6] border-4 border-[#4BB543] flex flex-row justify-between items-center py-11 min-h-[198px] mb-16 mt-16">
              <div className="flex flex-col p-4">
                <h1 className="text-[#4BB543] text-4xl font-bold mb-6">
                  Pagamento Confirmado!
                </h1>
                <p className="text-quaternary text-md font-bold">
                  Seu pagamento foi confirmado e agora falta bem pouco para o
                  seu anúncio estar no ar!
                </p>
              </div>
              <CheckedIcon />
            </div>

            {/**Payment info */}
            <div className="flex flex-row justify-between items-center px-2">
              <div className="flex flex-col mb-2 lg:mr-96">
                <h2 className="text-quaternary text-2xl md:text-4xl font-bold mb-10">
                  Informações do pagamento
                </h2>
                <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4">
                  PAGAMENTO
                </h2>
                <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4">
                  PLANO
                </h2>
                <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4">
                  VALOR
                </h2>
                <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4">
                  PARCELAS
                </h2>
              </div>
              <div className="flex flex-col items-center">
                {cardFlag === '' ? (
                  <h2 className="text-quaternary text-lg md:text-3xl font-medium mb-4">
                    Cartão de crédito
                  </h2>
                ) : (
                  <div className="flex flex-row items-center justify-between mt-20">
                    <h2 className="text-quaternary text-lg mr-2 md:text-3xl font-medium mb-4">
                      Cartão de crédito
                    </h2>
                    {cardFlag === 'mastercard' && (
                      <MastercardIcon viewBox="0 5 48 48" />
                    )}
                    {cardFlag === 'visa' && <VisaIcon viewBox="0 5 48 48" />}
                  </div>
                )}

                <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4">
                  {selectedPlan.plan}
                </h2>
                <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4">
                  R${' '}
                  {selectedPlan.plan === 'FREE'
                    ? selectedPlan.value
                    : selectedPlan.plan === 'BÁSICO'
                    ? selectedPlan.value
                    : selectedPlan.plan === 'PLUS'
                    ? selectedPlan.value
                    : '---'}
                </h2>
                <h2 className="text-quaternary text-3xl font-medium mb-4">
                  -{installments ? '' : '-'}
                </h2>
              </div>
            </div>
            <div className="w-3/4 max-w-6xl h-[1px] bg-quaternary mb-4" />
            <div className="flex flex-row justify-between w-96">
              <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4 ml-2 md:ml-0">
                TOTAL
              </h2>
              <h2 className="text-quaternary text-xl md:text-3xl font-medium mb-4 px-8 md:px-0 md:mr-16">
                R${' '}
                {selectedPlan.plan === 'FREE'
                  ? selectedPlan.value
                  : selectedPlan.plan === 'BÁSICO'
                  ? selectedPlan.value
                  : selectedPlan.plan === 'PLUS'
                  ? selectedPlan.value
                  : '---'}
              </h2>
            </div>
            {/**Button */}
          </div>
          <div className="grid w-full">
            <div className="flex justify-end mb-32 mt-16 lg:mr-28">
              <button
                className="bg-primary w-96 h-16 rounded"
                onClick={handleContinueBtn}
              >
                <span className="text-quinary font-bold text-3xl p-2">
                  Continuar
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
