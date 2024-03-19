import { useState } from 'react';
import { IPlan } from '../../../common/interfaces/plans/plans';
import { IRegisterPropertyData_Step3 } from '../../../common/interfaces/property/register/register';
import { IStoredData } from '../../../common/interfaces/property/register/store';
import MastercardIcon from '../../atoms/icons/mastercard';
import VisaIcon from '../../atoms/icons/visaIcon';

export type PaymentData = {
  cardBrand: string;
  value: string;
};

type StoredData = {
  paymentData: PaymentData;
  propertyDataStep3: IRegisterPropertyData_Step3;
  storedData: IStoredData;
};

export interface IPaymentBoard_Step3_5 {
  selectedPlan?: IPlan;
  selectedCard?: string;
  storedData: StoredData;
  plans: IPlan[];
}

const PaymentBoard_Step3_5 = ({
  selectedPlan,
  selectedCard,
  storedData,
  plans,
}: IPaymentBoard_Step3_5) => {
  const [cardFlag, setCardFlag] = useState<string>(
    storedData ? storedData.paymentData.cardBrand : ''
  );
  const [plan, setPlan] = useState<IPlan | undefined>(
    plans && storedData
      ? plans.find((plan) => plan._id === storedData.propertyDataStep3.plan)
      : undefined
  );

  const classes = {
    paymentLabel: 'text-quaternary text-lg md:text-xl font-medium mb-4',
    planLabel: 'text-quaternary  text-lg md:text-xl font-medium mb-4',
  };

  return (
    <>
      <div className="px-2">
        <h2 className="md:text-2xl text-lg leading-10 text-quaternary font-bold md:mb-10 mb-5">
          Informações do pagamento
        </h2>
        <div className="flex flex-row justify-between items-center ">
          <div className="flex flex-col">
            <h2 className={classes.paymentLabel}>PAGAMENTO</h2>
            <h2 className={classes.paymentLabel}>PLANO</h2>
            <h2 className={classes.paymentLabel}>VALOR</h2>
            <h2 className={classes.paymentLabel}>PARCELAS</h2>
          </div>
          <div className="flex flex-col items-end">
            {cardFlag === '' ? (
              <h2 className="text-quaternary text-lg md:text-2xl font-medium mb-4">
                Cartão de crédito
              </h2>
            ) : (
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-quaternary text-lg mr-2 md:text-2xl font-medium mb-4">
                  {plan?.price === 0 ? '---' : 'Cartão de crédito'}
                </h2>
                {cardFlag === 'MASTERCARD' && plan?.price != 0 && (
                  <MastercardIcon viewBox="0 5 48 48" />
                )}
                {cardFlag === 'VISA' && <VisaIcon viewBox="0 5 48 48" />}
              </div>
            )}

            <h2 className={classes.planLabel}>{plan?.name}</h2>
            <h2 className={classes.planLabel}>R$ {plan?.price},00</h2>
            <h2 className="text-quaternary text-3xl font-medium mb-4">
              -{'-'}
            </h2>
          </div>
        </div>
      </div>
      <div className="w-3/4 max-w-6xl h-[1px] bg-quaternary mb-4 mx-auto" />
      <div className="flex flex-row justify-between px-2">
        <h2 className="text-quaternary text-lg md:text-xl font-medium mb-4 md:ml-0">
          TOTAL
        </h2>
        <h2 className="text-quaternary text-lg md:text-xl w-fit font-medium mb-4 md:px-0">
          R$ {plan?.price},00
        </h2>
      </div>
    </>
  );
};

export default PaymentBoard_Step3_5;

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
