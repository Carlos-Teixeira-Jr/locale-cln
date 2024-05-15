export interface ILinearStepper {
  activeStep: number
}

const LinearStepper = ({ activeStep }: ILinearStepper) => {

  const steps = [
    {
      key: 1,
      number: 1,
      description: 'Informações do imóvel'
    },
    {
      key: 2,
      number: 2,
      description: 'Fotos'
    },
    {
      key: 3,
      number: 3,
      description: 'Informações de cobrança'
    },
    {
      key: 4,
      number: 4,
      description: 'Anunciar'
    }
  ]

  return (
    <div className='flex w-full px-2'>
      {steps?.map((step, idx) => (
        <>
          <div className={`rounded-full w-7 h-7 mx-1 shrink-0 text-tertiary text-center font-semibold pt-[2px] my-auto ${step.key < activeStep + 2 ?
            'bg-secondary drop-shadow-lg' :
            'bg-primary drop-shadow-md'
            }`}>{step.number}</div>
          {idx !== steps.length - 1 && (
            <div className={`w-full my-auto ${idx <= activeStep - 1 ? 'bg-primary drop-shadow-lg h-[0.25rem]' : 'bg-quaternary drop-shadow h-[0.15rem]'
              }`}></div>
          )}
        </>
      ))}
    </div>
  )
}


export default LinearStepper;