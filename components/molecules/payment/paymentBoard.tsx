import React, { useEffect, useState } from "react";
import { IPlan } from "../../../common/interfaces/plans/plans";
import CheckIcon from "../../atoms/icons/checkIcon";

interface IPaymentBoard {
  onTermsChange: (value: boolean) => void;
  selectedPlan: string
  plans: IPlan[]
  termsError: string
  ownerActualPlan: IPlan
}

const PaymentBoard: React.FC<IPaymentBoard> = ({
  onTermsChange,
  selectedPlan,
  plans,
  termsError,
  ownerActualPlan
}) => {

  const [selectedPlanCard, setSelectedPlanCard] = useState(plans.find((plan) => plan._id === selectedPlan));
  const defaultPlan = plans.find((plan) => plan.name === 'Free');
  const [terms, setTermsAreRead] = useState(false);
  const [errors, setErrors] = useState('');
  const [isSamePlan, setIsSamePlan] = useState(true);

  useEffect(() => {
    if (selectedPlanCard?._id === ownerActualPlan?._id) {
      setIsSamePlan(true)
    } else {
      setIsSamePlan(false)
    }
  }, [selectedPlanCard])

  useEffect(() => {
    setErrors(termsError)
  }, [termsError])

  useEffect(() => {
    setSelectedPlanCard(plans.find((plan) => plan._id === selectedPlan))
  }, [selectedPlan])

  useEffect(() => {
    onTermsChange(terms);
  }, [terms]);

  return (
    <div className="mx-5">
      <div
        className="mt-10 bg-tertiary border border-quaternary md:py-5 md:px-56 p-5 flex flex-col"
      >
        <div className="flex justify-between mb-5 gap-14 md:gap-0">
          <p className="md:text-2xl text-md font-semibold leading-7 text-quaternary">
            Plano Selecionado:
          </p>
          <span className="md:text-2xl text-md font-semibold leading-7 text-quaternary">
            Plano {selectedPlanCard ? selectedPlanCard?.name : defaultPlan?.name}
            <span className="text-sm">{isSamePlan && ` - (plano atual)`}</span>
          </span>
        </div>
        <div className="flex justify-between mb-5">
          <p className="md:text-2xl text-md font-semibold leading-7 text-quaternary">
            Valor do Plano:
          </p>
          <span className="md:text-2xl text-md font-semibold leading-7 text-quaternary">
            {isSamePlan ? 'R$ 0,00' : `R$ ${selectedPlanCard?.price},00`}
          </span>
        </div>
        <hr className="border-b border-quaternary mb-5" />
        <div className="flex justify-between">
          <p className="text-2xl font-semibold leading-7 text-quaternary">
            Valor Total:
          </p>
          <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
            {isSamePlan ? 'R$ 0,00' : `R$ ${selectedPlanCard?.price},00`}
          </span>
        </div>
      </div>
      <div className="lg:flex justify-between my-2">
        <div className="flex my-auto">
          <div
            className=" w-8 h-8 shrink-0 border border-quaternary bg-tertiary rounded-[10px] drop-shadow-lg my-auto cursor-pointer"
            onClick={() => {
              setErrors('');
              setTermsAreRead(!terms);
            }}
            style={errors ? { border: '1px solid red' } : {}}
          >
            {terms && (
              <CheckIcon
                fill="#F5BF5D"
                viewBox="100 180 960 960"
                width="35"
                className="pb-3"
              />
            )}
          </div>
          <div className="flex flex-col">
            <p
              className="mx-5 text-quaternary text-xs md:text-lg font-normal my-auto"
              style={errors ? { color: 'red' } : {}}
              id="terms"
            >
              Li e concordo com os termos descritos no contrato e políticas de
              qualidade.{' '}
              <a className="text-secondary cursor-pointer">
                Ler contrato referente ao plano
              </a>
            </p>
            {errors && (
              <span className="text-red-500 mt-2 lg:mt-0 ml-5">
                {errors}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentBoard