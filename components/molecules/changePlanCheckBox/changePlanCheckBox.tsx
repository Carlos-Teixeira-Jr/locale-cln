import { useEffect, useState } from "react";
import CheckIcon from "../../atoms/icons/checkIcon";

interface IChangePlanCheckbox {
  onChangePlanClick: (isChecked: boolean) => void
}

const ChangePlanCheckbox = ({ onChangePlanClick }: IChangePlanCheckbox) => {

  const [changePlan, setChangePlan] = useState(false);

  useEffect(() => {
    onChangePlanClick(changePlan)
  }, [changePlan])

  return (
    <section>
      <div className={`flex flex-col md:mt-5 md:mb-10`}>
        <div className={`flex justify-start px-5 my-5 md:my-0`}>
          <div
            className={`w-7 h-7 border bg-tertiary rounded-[10px] drop-shadow-lg cursor-pointer my-auto shrink-0 ${changePlan ? 'border-secondary' : 'border-quaternary'
              }`}
            onClick={() => {
              setChangePlan(!changePlan)
            }}
          >
            {changePlan && (
              <CheckIcon
                fill="#F5BF5D"
                width="32"
                className={`pb-5 pr-1 ${changePlan ? ' border-secondary' : ''
                  }`}
              />
            )}
          </div>
          <h3 className="md:text-2xl text-xl mx-5 leading-10 text-quaternary font-bold my-auto">
            Alterar plano
          </h3>
        </div>
      </div>
    </section>
  )
}

export default ChangePlanCheckbox