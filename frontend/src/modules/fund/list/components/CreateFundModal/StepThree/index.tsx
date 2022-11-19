import { useEffect, useState } from 'react';
import assetsDataStatic from './../../../assetsData'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import './index.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';
import {ContractFactory, utils, providers} from 'ethers'
import {mutual} from './../../../../../../contract/Mutual'
import { MoralisProvider, useMoralis } from 'react-moralis';
import { CHAINLINK_ETH_USD, UNISWAP_V2_ROUTER } from '../../../../../../contract/Constants';
import console from 'console-browserify'


interface props {
  handleSetStep: (step: number) => void
  selectedAssets: any
}

function StepThree({ selectedAssets, handleSetStep }: props) {

  const { signup, isAuthenticated, user, Moralis, web3, provider } = useMoralis();

  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [minUSDToJoin, setMinUSDToJoin] = useState<any>(null);
  const [description, setDescription] = useState<any>('');
  const [loading, setLoading] = useState<any>(false);


  const deployContract = async() => {
    setLoading(true)
    console.log('selectedAssets', selectedAssets)

    const contractsAddress = selectedAssets.map((asset: any) => asset.address)
    const chainlinkUsdConversionAddress = selectedAssets.map((asset: any) => asset.chainlinkUsdConversion)
    const assetAllocation = selectedAssets.map((asset: any) => asset.value)


    console.log('provider', provider)

    const web3Provider = new providers.Web3Provider(provider!);
    const signer = web3Provider.getSigner();
    console.log('signer', signer)

    const factory = new ContractFactory(mutual.abi, mutual.bytecode, signer)

    const contract = await factory.deploy(
      CHAINLINK_ETH_USD,
      contractsAddress,
      chainlinkUsdConversionAddress,
      assetAllocation,
      minUSDToJoin,
      tokenName,
      tokenSymbol,
      UNISWAP_V2_ROUTER, {
        value: utils.parseEther('0.1')
      }
    );

    addToLocalStorage(contract.address)

    await contract.deployTransaction.wait();

    setLoading(true)

  }

  const addToLocalStorage = (newContract: string) => {
    const contracts = localStorage.getItem("contracts");
    let actualContracts = []
    if (contracts) {
      actualContracts = JSON.parse(contracts)
    }

    actualContracts.push(newContract)

    console.log('actualContracts', actualContracts)

    localStorage.setItem("contracts", JSON.stringify(actualContracts));
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
          disabled={!(tokenSymbol && tokenName && minUSDToJoin && description) || loading}
          variant="contained"
          onClick={deployContract}>Create Fund (0.1 Eth)</Button>
      </div>
    </div>
  );
}

export default StepThree;
