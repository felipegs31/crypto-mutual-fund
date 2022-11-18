import Modal from '@mui/material/Modal';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import assetsDataStatic from './../../assetsData'
import StepOne from './StepOne';
import console from 'console-browserify'
import StepThree from './StepThree';
import StepTwo from './StepTwo';

interface props {
  open: any
  onClose: () => void
}

const steps = [
  'Assets and distribution',
  'Staking protocol',
  'Token name and Symbol'
];

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function CreateFundModal({ open, onClose }: props) {

  const [step, setStep] = useState(0);
  const [selectedAssets, setSelectedAssets] = useState<any>([]);
  const [selectedStakingProtocols, setSelectedStakingProtocols] = useState<any>([]);


  const handleSetStep = (step: number) => {
    setStep(step)
  }

  const handleSetSelectedAssets = (asset: any) => {
    setSelectedAssets(asset)
  }

  const handleSetSelectedStakingProtocols = (stakingProtocol: any) => {
    setSelectedStakingProtocols(stakingProtocol)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>
        <Box sx={style}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {step === 0 &&
            <StepOne handleSetStep={handleSetStep} selectedAssets={selectedAssets} handleSetSelectedAssets={handleSetSelectedAssets}/>
          }
          {step === 1 &&
            <StepTwo selectedStakingProtocols={selectedStakingProtocols} handleSetStep={handleSetStep} handleSetSelectedStakingProtocols={handleSetSelectedStakingProtocols}/>
          }
          {step === 2 &&
            <StepThree selectedAssets={selectedAssets} handleSetStep={handleSetStep}/>
          }
        </Box>

      </div>
    </Modal>
  );
}

export default CreateFundModal;
