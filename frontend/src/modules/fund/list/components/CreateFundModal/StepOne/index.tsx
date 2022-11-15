import { useEffect, useState } from 'react';
import assetsDataStatic from './../../../assetsData'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import './index.css'

function StepOne() {

  const [assetsData, setAssetsData] = useState(assetsDataStatic);
  const [selectedAssets, setSelectedAssets] = useState<any>([]);
  const [sliderPositions, setSliderPositions] = useState([100]);
  const [trackerColors, setTrackerColors] = useState(['#0C2960', '#0C2960']);


  const rebalanceAssetDistribution = (assets: any) => {
    let assetsArray = [];
    for (let i = 0; i < assets.length; i++) {
      console.log('assets.name', assets[i].name)

      let value = Math.floor(100 / assets.length)
      let devider: any = i === 0 ? value : assetsArray[i - 1].devider + value

      if (i === 0) {
        devider = value
      } else if (i === (assets.length - 1)) {
        const valuesSum = assetsArray.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);
        value = 100 - valuesSum
        devider = 100
      } else {
        devider = assetsArray[i - 1].devider + value
      }

      console.log('value', value)
      console.log('devider', devider)

      const newObject = {
        ...assets[i],
        value,
        devider
      }
      assetsArray.push(newObject)
    }

    console.log('assetsArray', assetsArray)
    return assetsArray

  }

  const handleSelectAsset = (address: string) => {
    const assetIndex = selectedAssets.findIndex((asset: any) => asset.address === address)
    if (assetIndex === -1) {
      const assetDataIndex = assetsData.findIndex((asset: any) => asset.address === address)

      const newAsset = {
        address,
        name: assetsData[assetDataIndex].name,
        symbol: assetsData[assetDataIndex].symbol,
        color: assetsData[assetDataIndex].color
      }

      let newAssetList = [...selectedAssets, newAsset]

      const newAssetListBalanced = rebalanceAssetDistribution(newAssetList)

      setSelectedAssets(newAssetListBalanced);
    } else {
      let newAssetList = [...selectedAssets]
      newAssetList.splice(assetIndex, 1)

      const newAssetListBalanced = rebalanceAssetDistribution(newAssetList)

      setSelectedAssets(newAssetListBalanced)
    }
  }

  const isSelected = (asset: any) => {
    return selectedAssets.findIndex((selectedAsset: any) => selectedAsset.address === asset.address) > -1
  }

  console.log('selectedAssets', selectedAssets)

  const buildLinerGradient = () => {
    let text = ''
    if (selectedAssets.length > 0) {
      text += `linear-gradient(to right, ${selectedAssets[0].color} 0%`
      selectedAssets.forEach((asset: any, index: number) => {
        if (index > 0) {
          text += `, ${asset.color} ${selectedAssets[index - 1].devider}%`
        }
        text += `, ${asset.color} ${asset.devider}%`
      })
    }
    return text
  }

  return (
    <div>
      {selectedAssets.length > 0 && <div className="slider-container">
        <div
          style={{
            borderRadius: 4,
            width: '100%',
            height: 20,
            background: `${buildLinerGradient()}`
          }}>
        </div>
      </div>}
      <div style={{
        display: 'flex',
        marginTop: 10,
        marginBottom: 20
      }}>
        {selectedAssets.map((asset: any) =>
          <div
            key={asset.address}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: `${asset.value}%`
            }}>
            <div
              style={{
                borderRadius: 30,
                width: 25,
                height: 25,
                backgroundColor: asset.color,
                marginRight: 5
              }}>
            </div>
            <span style={{
              fontSize: '0.75rem',
            }}>{asset.name}: {asset.value}%</span>
          </div>
        )}
      </div>
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
    </div>

  );
}

export default StepOne;
