import { useEffect, useState } from 'react';
import stakingProtocolsStatic from '../../../stakingProtocolsData'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import './index.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import console from 'console-browserify'

interface props {
  selectedStakingProtocols: any
  handleSetStep: (step: number) => void
  handleSetSelectedStakingProtocols: (asset: any) => void
}

function StepTwo({selectedStakingProtocols, handleSetStep, handleSetSelectedStakingProtocols}: props) {

  const [stakingProtocols, setStakingProtocols] = useState(stakingProtocolsStatic);


  const handleSelectAsset = (address: string) => {
    const assetIndex = selectedStakingProtocols.findIndex((asset: any) => asset.address === address)
    if (assetIndex === -1) {
      const assetDataIndex = stakingProtocols.findIndex((asset: any) => asset.address === address)

      const newAsset = {
        address,
        name: stakingProtocols[assetDataIndex].name,
        color: stakingProtocols[assetDataIndex].color
      }

      let newAssetList = [...selectedStakingProtocols, newAsset]

      handleSetSelectedStakingProtocols(newAssetList);
    } else {
      let newAssetList = [...selectedStakingProtocols]
      newAssetList.splice(assetIndex, 1)

      handleSetSelectedStakingProtocols(newAssetList)
    }
  }

  const isSelected = (asset: any) => {
    return selectedStakingProtocols.findIndex((selectedAsset: any) => selectedAsset.address === asset.address) > -1
  }

  console.log('selectedStakingProtocols', selectedStakingProtocols)


  const handleNextStep = () => {
    handleSetStep(2)
  }

  return (
    <div>
      <Grid container spacing={2}>
        {stakingProtocols.map(asset =>
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
                  isSelected(asset) ? '#eaeaea' : '#fff',
              }}
              elevation={isSelected(asset) ? 0 : 3}
              onClick={() => handleSelectAsset(asset.address)}
            >
              <Avatar
                alt="Asset Image"
                src={asset.image}
                sx={{ width: 56, height: 56 }}
              />
              {asset.name}
            </Paper>
          </Grid>
        )}
      </Grid>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 20
        }}
      >
        <Button
          disabled={selectedStakingProtocols.length === 0}
          variant="contained"
          onClick={handleNextStep}>Next</Button>
      </div>
    </div>

  );
}

export default StepTwo;
