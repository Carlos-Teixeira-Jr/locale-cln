import React, { useEffect, useState } from "react"
import CheckIcon from "../../atoms/icons/checkIcon";
import { IPlan } from "../../../common/interfaces/plans/plans";
import { OnErrorInfo } from "../uploadImages/uploadImages";
import { resetObjectToEmptyStrings } from "../../../common/utils/resetObjects";

interface IPaymentBoard {
  onTermsChange: (value: boolean) => void;
  selectedPlan: string
  plans: IPlan[]
  onErrorInfo: OnErrorInfo
}

const PaymentBoard: React.FC<IPaymentBoard> = ({
  onTermsChange,
  selectedPlan,
  plans,
  onErrorInfo
}) => {

  const [selectedPlanCard, setSelectedPlanCard] = useState(plans.find((plan) => plan._id === selectedPlan));
  const defaultPlan = plans.find((plan) => plan.name === 'Free');
  const [terms, setTermsAreRead] = useState(false);
  const [errors, setErrors] = useState({
    plan: '',
    terms: false
  });

  useEffect(() => {
    setSelectedPlanCard(plans.find((plan) => plan._id === selectedPlan))
  }, [selectedPlan])
  
  
  useEffect(() => {
    if (onErrorInfo) {
      resetObjectToEmptyStrings(errors);
      setErrors(prevErrors => ({
        ...prevErrors,
        [onErrorInfo.prop]: onErrorInfo.error,
      }));
    }
  }, [onErrorInfo]);

  useEffect(() => {
    onTermsChange(terms);
  }, [terms]);

  return (
    <div>
      <div
        className="mt-10 bg-tertiary border border-quaternary md:py-5 md:px-56 p-5 flex flex-col"
        style={errors.plan ? { border: '1px solid red' } : {}}
      >
        <div className="flex justify-between mb-5">
          <p className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
            Plano Selecionado:
          </p>
          <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              Plano {selectedPlanCard ? selectedPlanCard?.name : defaultPlan?.name}
            </span>
        </div>
        <div className="flex justify-between mb-5">
          <p className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
            Valor do Plano:
          </p>
          <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
            R$ {selectedPlanCard ? selectedPlanCard?.price : defaultPlan?.price},00 
          </span>
        </div>
        <hr className="border-b border-quaternary mb-5" />
        <div className="flex justify-between">
          <p className="text-2xl font-semibold leading-7 text-quaternary">
            Valor Total:
          </p>
          <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
            R$ {selectedPlanCard ? selectedPlanCard?.price : defaultPlan?.price},00 
          </span>
        </div>
      </div>
      {errors.plan !== '' && (
        <span className="text-red-500 mt-2">{errors.plan}</span>
      )}
      <div className="lg:flex justify-between md:my-2">
        <div className="flex my-auto">
          <div
            className=" w-8 h-8 shrink-0 border border-quaternary bg-tertiary rounded-[10px] drop-shadow-lg my-auto cursor-pointer"
            onClick={() => {
              setTermsAreRead(!terms);
              resetObjectToEmptyStrings(errors);
            }}
            style={errors.terms ? { border: '1px solid red' } : {}}
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
              className="mx-5 md:text-lg font-normal leading-7 my-auto"
              style={errors.terms ? { color: 'red' } : {}}
              id="terms"
            >
              Li e concordo com os termos descritos no contrato e políticas de
              qualidade.{' '}
              <a className="text-secondary cursor-pointer">
                Ler contrato referente ao plano
              </a>
            </p>
            {errors.terms && (
              <span className="text-red-500 ml-5">
                {errors.terms}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentBoard