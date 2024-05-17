import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { IOwnerData } from '../../../common/interfaces/owner/owner';
import { IPlan } from '../../../common/interfaces/plans/plans';
import { IRegisterPropertyData_Step3 } from '../../../common/interfaces/property/register/register';
import { IStoredData } from '../../../common/interfaces/property/register/store';
import MastercardIcon from '../../atoms/icons/mastercard';
import VisaIcon from '../../atoms/icons/visaIcon';

export type PaymentData = {
  cardBrand: string;
  value: string;
  couponUsed: boolean
};

type StoredData = {
  paymentData: PaymentData;
  propertyDataStep3: IRegisterPropertyData_Step3;
  storedData: IStoredData;
};

export interface IPaymentBoard_Step3_5 {
  storedData: StoredData;
  plans: IPlan[];
  ownerData?: IOwnerData
}

const PaymentBoard_Step3_5 = ({
  storedData,
  plans,
  ownerData
}: IPaymentBoard_Step3_5) => {

  const cardFlag = storedData ? storedData.paymentData.cardBrand : '';
  const couponWasUsed = storedData?.paymentData?.couponUsed ? true : false

  const plan = plans && ownerData?.owner
    ? plans.find((plan) => plan._id === ownerData?.owner?.plan)
    : undefined;

  const classes = {
    paymentLabel: 'text-quaternary text-md md:text-xl font-medium mb-4',
    planLabel: 'text-quaternary text-lg md:text-xl font-medium mb-4',
  };

  return (
    <>
      <div className="px-2">
        <h2 className="md:text-2xl text-center md:text-start text-lg leading-10 text-quaternary font-bold md:mb-10 mb-5">
          Informações do pagamento
        </h2>
        <div className="flex flex-row justify-between items-center ">
          <div className="flex flex-col">
            <h2 className={classes.paymentLabel}>PAGAMENTO</h2>
            <h2 className={classes.paymentLabel}>PLANO</h2>
            <h2 className={classes.paymentLabel}>VALOR</h2>
          </div>
          <div className="flex flex-col items-end">
            {cardFlag === '' ? (
              <h2 className="text-quaternary text-lg md:text-2xl font-medium">
                Cartão de crédito
              </h2>
            ) : (
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-quaternary text-lg md:text-2xl font-medium">
                  {plan?.price === 0 ? '---' : 'Cartão de crédito'}
                </h2>
                {cardFlag === 'MASTERCARD' && plan?.price! > 0 && (
                  <MastercardIcon viewBox="0 5 48 48" />
                )}
                {cardFlag === 'VISA' && plan?.price !== 0 && <VisaIcon viewBox="0 5 48 48" />}
              </div>
            )}

            <h2 className={classes.planLabel}>
              {plan?.name}
            </h2>
            <h2 className={classes.planLabel}>
              R$ {plan?.price !== undefined ? plan?.price : '00'},00
            </h2>
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
          R$ {plan?.price !== undefined ? plan?.price : '00'},00
        </h2>
      </div>
    </>
  );
};

export default PaymentBoard_Step3_5;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const session = (await getSession(context)) as any;
  let ownerData;
  const userId = session?.user.data._id || session?.user.id;

  const plans = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan`)
    .then((res) => res.json())
    .catch(() => ({}));

  try {
    const ownerIdResponse = await fetch(
      `${baseUrl}/user/find-owner-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (ownerIdResponse.ok) {
      const response = await ownerIdResponse.json();
      ownerData = response;
    }
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      plans,
      ownerData
    },
    revalidate: 60,
  };
}
