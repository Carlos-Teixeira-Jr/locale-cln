import { StepLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IStep {
  isSubmited?: boolean;
  sharedActiveStep: number;
}

const LinearStepper = ({ isSubmited, sharedActiveStep }: IStep) => {

  const steps = ['', '', '', ''];

  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (isSubmited) {
    router.push("/register-step-2")
    setActiveStep((currentStep) => currentStep + 1);
    }
  };

  const handleBack = () => {
    // navigate("/PASSO ANTERIOR")
    setActiveStep((currentStep) => currentStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <Box sx={{ width: '100%', mt: 2, px: 0 }}>
        <Stepper activeStep={sharedActiveStep}>
          {steps.map((label, _) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step
                key={label}
                {...stepProps}
                sx={{
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#F5BE5F', // circle color (COMPLETED)
                  },
                  '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                    {
                      color: '#FFFFFF', // Just text label (COMPLETED)
                    },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: '#F75D5F', // circle color (ACTIVE)
                  },
                  '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                    {
                      color: '#FFFFFF', // Just text label (ACTIVE)
                    },
                  '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                    fill: '#FFFFFF', // circle's number (ACTIVE)
                  },
                }}
              >
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto', color: 'lightGray' }} />
              <Button
                onClick={handleReset}
                sx={{ color: '#6B7280', fontWidth: 700 }}
              >
                Reset
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                pt: 2,
                color: 'lightGray',
              }}
            >
              {/* <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, color: 'lightGray' }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto', color: 'lightGray' }} />
              <Button
                onClick={handleNext}
                sx={{ color: '#F75D5F', fontWidth: 700 }}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button> */}
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};


export default LinearStepper;