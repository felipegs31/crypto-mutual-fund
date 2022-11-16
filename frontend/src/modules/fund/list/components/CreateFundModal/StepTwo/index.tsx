import { useEffect, useState } from 'react';
import assetsDataStatic from './../../../assetsData'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import './index.css'
import Draggable from 'react-draggable';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';

interface props {
  handleSetStep: (step: number) => void
}

function StepTwo({ handleSetStep }: props) {

  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [minUSDToJoin, setMinUSDToJoin] = useState<any>(null);
  const [description, setDescription] = useState<any>('');

  const handleNextStep = () => {
    handleSetStep(2)
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <FormControl fullWidth>
          <TextField
            variant="standard"
            label='Token Symbol'
            name='tokenSymbol'
            onChange={event => setTokenSymbol(event.target.value)}
            value={tokenSymbol}
            type='text'
            margin='normal' />
          <TextField
            variant="standard"
            label='Token Name'
            name='tokenName'
            onChange={event => setTokenName(event.target.value)}
            value={tokenName}
            type='text'
            margin='normal' />
          <TextField
            InputProps={{
              inputProps: {
                min: 1
              }
            }}
            variant="standard"
            type="number"
            label='Minimum USD to join'
            name='minusdtojoin'
            onChange={event => setMinUSDToJoin(event.target.value)}
            value={minUSDToJoin}
            margin='normal' />
          <TextField
            id="standard-multiline-static"
            label="Fund Description"
            multiline
            rows={4}
            variant="standard"
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </FormControl>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 20
        }}
      >
        <Button
          variant="contained"
          onClick={handleNextStep}>Next</Button>
      </div>
    </div>
  );
}

export default StepTwo;
