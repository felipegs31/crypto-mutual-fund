import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useParams } from "react-router-dom";
import { mutual } from "../../../contract/Mutual";
import Chart from "./components/Chart";
import Deposits from "./components/Deposits";
import Orders from "./components/Transactions";
import Widget from "./components/Widget";
import assetsDataStatic from './../list/assetsData';
import { assetsMapQuery } from "../../../utils/contractCalls";
import console from 'console-browserify'
import { PieChart } from "react-minimal-pie-chart";
import { ethers } from "ethers";
import SendIcon from '@mui/icons-material/Send';
import { CircularProgress } from '@mui/material';

function Detail() {

  const {
    authenticate,
    isWeb3Enabled,
    isAuthenticated,
    enableWeb3,
    Moralis,
    isWeb3EnableLoading,
    provider,
    account
  } = useMoralis();

  let { id: contractAddress } = useParams();

  const [minimumUSDJoin, setMinimumUSDJoin] = useState('0')
  const [addresses, setAddresses] = useState([])
  const [assetsMap, setAssetsMap] = useState([])

  const [erc20Name, setErc20Name] = useState([])
  const [erc20Symbol, setErc20Symbol] = useState([])
  const [erc20MyBalance, setErc20MyBalance] = useState('0')

  const [ethToDeposit, setEthToDeposit] = useState('0')
  const [erc20ToDeposit, setERC20ToDeposit] = useState('0')


  const [loadingDeposit, setLoadingDeposit] = useState(false)
  const [LoadingERC20Deposit, setLoadingERC20Deposit] = useState(false)


  const [dataChart, setDataChart] = useState([])

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
  }, [isAuthenticated, isWeb3Enabled]);

  useEffect(() => {
    console.log('contractAddress', contractAddress)
    if (isWeb3Enabled && contractAddress) {
      minimumUSDJoinQuery()
      assetQuantityQuery()
      erc20TokenName()
      erc20TokenSymbol()
      erc20TokenBalance()
    }
  }, [isWeb3Enabled, contractAddress]);

  async function minimumUSDJoinQuery() {
    const options: any = {
      contractAddress: contractAddress,
      functionName: "minimumUSDJoin",
      abi: mutual.abi,
    };
    const minUSD = await Moralis.executeFunction(options);

    setMinimumUSDJoin(minUSD.toString());
  }

  async function erc20TokenBalance() {
    console.log('account', account)
    const options: any = {
      contractAddress: contractAddress,
      functionName: "balanceOf",
      abi: mutual.abi,
      params: {
        account: account
      }
    };
    const myBalance: any = await Moralis.executeFunction(options);
    console.log('myBalance', myBalance)

    setErc20MyBalance(myBalance.toString());
  }

  async function erc20TokenName() {
    const options: any = {
      contractAddress: contractAddress,
      functionName: "name",
      abi: mutual.abi,
    };
    const name: any = await Moralis.executeFunction(options);

    setErc20Name(name);
  }

  async function erc20TokenSymbol() {
    const options: any = {
      contractAddress: contractAddress,
      functionName: "symbol",
      abi: mutual.abi,
    };
    const symbol: any = await Moralis.executeFunction(options);

    setErc20Symbol(symbol);
  }

  async function assetQuantityQuery() {
    const options: any = {
      contractAddress: contractAddress,
      functionName: "assetQuantity",
      abi: mutual.abi,
    };
    const assetQuantity = await Moralis.executeFunction(options);

    let addressesArray: any = []
    for (let i = 0; i < Number(assetQuantity); i++) {
      const address: any = await assetAddressesQuery(i)
      addressesArray.push(address)
    }

    setAddresses(addressesArray)
  }

  async function assetAddressesQuery(index: number) {
    const options: any = {
      contractAddress: contractAddress,
      functionName: "assetAddresses",
      abi: mutual.abi,
      params: {
        '': index
      },
    };
    const assetAddresses = await Moralis.executeFunction(options);
    return assetAddresses
  }

  useEffect(() => {
    getAssetsMapData()
  }, [addresses])


  const getAssetsMapData = async () => {

    let assetsMapDataArray: any = []

    for (let i = 0; i < addresses.length; i++) {
      const address: any = await assetsMapQuery(contractAddress!, addresses[i], provider)
      assetsMapDataArray.push(address)
    }


    setAssetsMap(assetsMapDataArray)
  }

  useEffect(() => {
    if (assetsMap && assetsMap.length > 0) {
      const chartData: any = assetsMap.map((assetContract: any) => {
        const assetContractAddress = assetContract[0]

        const contractDataIndex = assetsDataStatic.findIndex(s => {
          return s.address.toUpperCase() === assetContractAddress.toUpperCase()
        })
        return { title: assetsDataStatic[contractDataIndex].symbol, value: assetContract[1], color: assetsDataStatic[contractDataIndex].color }
      })
      setDataChart(chartData)
    }
  }, [assetsMap])



  const joinFund = async() => {
    setLoadingDeposit(true)
    const ethToDepositWei = ethers.utils.parseEther(ethToDeposit).toString()

    console.log('ethToDepositWei', ethToDepositWei)

    const web3Provider = new ethers.providers.Web3Provider(provider!);
    const signer = web3Provider.getSigner();

    const fundContract = new ethers.Contract(
      contractAddress!,
      mutual.abi,
      signer
    );

    const tx = await fundContract.joinFund({
      value: ethToDepositWei,
    });
    await tx.wait();

    setLoadingDeposit(false)
  }

  const widthdrawFund = async() => {
    setLoadingERC20Deposit(true)
    const erc20ToDepositWei = ethers.utils.parseEther(erc20ToDeposit).toString()

    console.log('erc20ToDepositWei', erc20ToDepositWei)

    const web3Provider = new ethers.providers.Web3Provider(provider!);
    const signer = web3Provider.getSigner();

    const fundContract = new ethers.Contract(
      contractAddress!,
      mutual.abi,
      signer
    );

    const tx = await fundContract.exitFund(erc20ToDepositWei);
    await tx.wait();

    setLoadingERC20Deposit(false)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Widget title="Wallets on Fund" total={32} icon={'ant-design:android-filled'} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Widget title="ETH on Contract" total={41.2} color="info" icon={'ant-design:apple-filled'} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Widget title="Gas Fees (Eth)" total={1.2} color="warning" icon={'ant-design:windows-filled'} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Widget title="APY" total={5} color="error" icon={'ant-design:bug-filled'} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item lg={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>My Balance</Typography>
            <Typography component="p" variant="h4">
              {ethers.utils.formatEther(erc20MyBalance).substring(0,8)}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              of {erc20Name} ({erc20Symbol})
            </Typography>

            <Typography component="h2" variant="h6" color="primary" gutterBottom>Invest on the Fund</Typography>

            <TextField
              InputProps={{
                inputProps: {
                  min: 1
                }
              }}
              variant="standard"
              type="number"
              label='Eth to deposit'
              name='minusdtojoin'
              onChange={event => setEthToDeposit(event.target.value)}
              value={ethToDeposit}
              margin='normal' />

            <Button disabled={!ethToDeposit || loadingDeposit} variant="contained" endIcon={<SendIcon />} onClick={joinFund}>
               <>Send Eth</>
            </Button>
          </Paper>
        </Grid>
        <Grid item lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Withdraw from the Fund</Typography>

            <TextField
              InputProps={{
                inputProps: {
                  min: 1
                }
              }}
              variant="standard"
              type="number"
              label={`${erc20Name} to deposit`}
              name='minusdtojoin'
              onChange={event => setERC20ToDeposit(event.target.value)}
              value={erc20ToDeposit}
              margin='normal' />

            <Button disabled={!erc20ToDeposit || LoadingERC20Deposit} variant="contained" endIcon={<SendIcon />} onClick={widthdrawFund}>
               <>Send ERC20</>
            </Button>
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>

            <PieChart data={dataChart} style={{ height: '100%' }} animate
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={{
                fill: 'white',
                fontSize: '10px'
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Detail;
