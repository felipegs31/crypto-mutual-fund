import Modal from '@mui/material/Modal';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import assetsDataStatic from './../../assetsData'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

interface props {
  open: any
  onClose: () => void
}

const steps = [
  'Assets and distribution',
  'Token name and Symbol',
  'Settings',
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
  const [assetsData, setAssetsData] = useState(assetsDataStatic);

  console.log('assetsData', assetsData)

  const handleSelectAsset = (address: string) => {
    console.log('address', address)
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
            <div>
              <Grid container spacing={2}>
                {assetsData.map(asset =>
                  <Grid item xs={3} key={asset.address}>
                    <Paper
                      sx={{
                        height: 100,
                        width: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#1A2027' : '#fef',
                      }}
                      onClick={() => handleSelectAsset(asset.address)}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={asset.image}
                        sx={{ width: 56, height: 56 }}
                      />
                      {asset.name}
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </div>
          }
        </Box>

      </div>
    </Modal>
  );
}

export default CreateFundModal;
