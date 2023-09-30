import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LinearStepper from '../components/atoms/stepper/stepper';
import PlansCardsHidden from '../components/molecules/cards/plansCards/plansCardHidden';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import RegisterFormStep3 from '../components/organisms/register/registerFormStep3';
import { NextPageWithLayout } from './page';

interface IRegisterStep3Props {
  selectedPlanCard: string;
  setSelectedPlanCard: (_selectedCard: string) => void;
  plans: any;
}

const RegisterStep3: NextPageWithLayout<IRegisterStep3Props> = ({ plans }) => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('');
  const reversedCards = [...plans].reverse();
  const [isAdminPage, setIsAdminPage] = useState(false);
  const setSelectedPlanCard = (selectedCard: string) => {
    setSelectedPlan(selectedCard);
  };

  useEffect(() => {
    const url = router.pathname;

    if (url === '/adminUserData') {
      setIsAdminPage(true);
    } else {
      setIsAdminPage(false);
    }
  }, [router.pathname]);

  return (
    <>
      <div className="fixed z-50 top-0 w-full">
        <Header />
      </div>
      <div className="flex items-center justify-center max-w-[1232px]">
        <div className="flex flex-col justify-center max-w-[1232px]">
          <div className="mt-[120px] md:mb-5 mx-auto lg:mx-[100px]">
            <LinearStepper isSubmited={false} sharedActiveStep={2} />
          </div>

          <div className="flex justify-center flex-col md:flex-row mx-auto max-w-[1232px] absolute z-40 top-[205px]">
            {reversedCards.map(
              ({ _id, name, price, highlightAd, commonAd, smartAd }: any) => (
                <PlansCardsHidden
                  key={_id}
                  selectedPlanCard={selectedPlan}
                  setSelectedPlanCard={(selectedCard: string) =>
                    setSelectedPlanCard(selectedCard)
                  }
                  isAdminPage={isAdminPage}
                  name={name}
                  price={price}
                  commonAd={commonAd}
                  highlightAd={highlightAd}
                  smartAd={smartAd}
                  id={_id}
                />
              )
            )}
          </div>

          <div className="max-w-[1536px] mt-[1150px] md:mt-[1300px] lg:mt-[425px] lg:mx-[100px] flex justify-center items-center flex-col">
            <RegisterFormStep3
              selectedPlanCard={selectedPlan}
              setSelectedPlanCard={(selectedCard: string) =>
                setSelectedPlanCard(selectedCard)
              }
            />
          </div>
        </div>
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep3;

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
