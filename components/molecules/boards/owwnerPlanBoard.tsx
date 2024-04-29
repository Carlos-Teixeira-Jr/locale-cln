import { useEffect, useState } from "react"
import { Owner } from "../../../common/interfaces/owner/owner"
import { IPlan } from "../../../common/interfaces/plans/plans"

interface IOwnerPlanBoard {
  ownerPlan: IPlan,
  owner: Owner | undefined,
  setIsChangePlan: (isChange: boolean) => void,
  isChangePlan: boolean
}

const OwnerPlanBoard = ({
  ownerPlan,
  owner,
  setIsChangePlan,
  isChangePlan
}: IOwnerPlanBoard) => {

  const [isChangePlanActive, setIsChangePlanActive] = useState(isChangePlan)

  useEffect(() => {
    setIsChangePlan(isChangePlanActive)
  }, [isChangePlanActive])

  return (
    <section className="w-[40rem] text-quaternary px-20 h-fit p-5 flex flex-col mx-auto mb-5 gap-3 border border-quaternary bg-tertiary">
      <h2 className="text-2xl font-bold text-quaternary">{`Seu plano atual é o ${ownerPlan?.name === 'Free' ? 'GRÁTIS' : ownerPlan?.name?.toUpperCase()}`}</h2>

      <h3 className="mt-2">Você ainda têm:</h3>

      <div className="gap-1 flex flex-col text-md text-quaternary">
        <span>{`${owner?.adCredits} x ${owner?.adCredits === 1 ? 'Crédito' : 'Créditos'} de anúncio`}</span>
        <span>{`${owner?.highlightCredits} x ${owner?.highlightCredits === 1 ? 'Crédito' : 'Créditos'} de anúncio`}</span>
      </div>

      <div className="mt-5">
        <button
          className={`flex items-center flex-row justify-around w-full h-14 text-tertiary rounded font-bold text-lg md:text-xl bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointe`}
          onClick={() => setIsChangePlanActive(true)}
        >
          Trocar de plano
        </button>
      </div>
    </section>
  )
}

export default OwnerPlanBoard