
interface IStep {
  isSubmited?: boolean;
  sharedActiveStep: number;
}

// const LinearStepper = ({ sharedActiveStep }: IStep) => {

//   const steps = [
//     {
//       key: 1,
//       label: ''
//     },
//     {
//       key: 2,
//       label: ''
//     },
//     {
//       key: 3,
//       label: ''
//     },
//     {
//       key: 4,
//       label: ''
//     },
//   ];

//   const [activeStep, setActiveStep] = useState(0);

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   return (
//     <div>
//       <Box sx={{ width: '100%', mt: 2, px: 0 }}>
//         <Stepper activeStep={sharedActiveStep}>
//           {steps.map((step) => {
//             const stepProps: { completed?: boolean } = {};
//             const labelProps: {
//               optional?: React.ReactNode;
//             } = {};
//             return (
//               <Step
//                 key={step.key}
//                 {...stepProps}
//                 sx={{
//                   '& .MuiStepLabel-root .Mui-completed': {
//                     color: '#F5BE5F', // circle color (COMPLETED)
//                   },
//                   '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
//                   {
//                     color: '#FFFFFF', // Just text label (COMPLETED)
//                   },
//                   '& .MuiStepLabel-root .Mui-active': {
//                     color: '#F75D5F', // circle color (ACTIVE)
//                   },
//                   '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
//                   {
//                     color: '#FFFFFF', // Just text label (ACTIVE)
//                   },
//                   '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
//                     fill: '#FFFFFF', // circle's number (ACTIVE)
//                   },
//                 }}
//               >
//                 <StepLabel {...labelProps}>{step.label}</StepLabel>
//               </Step>
//             );
//           })}
//         </Stepper>
//         {activeStep === steps.length ? (
//           <>
//             <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//               <Box sx={{ flex: '1 1 auto', color: 'lightGray' }} />
//               <Button
//                 onClick={handleReset}
//                 sx={{ color: '#6B7280', fontWidth: 700 }}
//               >
//                 Reset
//               </Button>
//             </Box>
//           </>
//         ) : (
//           <>
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'row',
//                 pt: 2,
//                 color: 'lightGray',
//               }}
//             >
//             </Box>
//           </>
//         )}
//       </Box>
//     </div>
//   );
// };

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
    <div className='flex w-full'>
      {steps?.map((step, idx) => (
        <>
          <div className={`rounded-full w-7 h-7 mx-1 shrink-0 text-tertiary text-center font-semibold pt-[2px] my-auto ${step.key < activeStep + 2 ?
            'bg-secondary drop-shadow-lg' :
            'bg-primary drop-shadow-md'
            }`}>{step.number}</div>
          {idx !== steps.length - 1 && (
            <div className={`w-full h-[0.15rem] my-auto ${idx <= activeStep - 1 ? 'bg-primary drop-shadow-lg' : 'bg-quaternary drop-shadow'
              }`}></div>
          )}
        </>
      ))}
    </div>
  )
}


export default LinearStepper;