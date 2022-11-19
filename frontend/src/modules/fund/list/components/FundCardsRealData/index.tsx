import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './index.css'
import Avatar from '@mui/material/Avatar';
import randomColor from 'randomcolor'
import Chart from '../../../../../designSystem/Chart';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { ExpandMore } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { PieChart } from 'react-minimal-pie-chart';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useApiContract, useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { mutual } from '../../../../../contract/Mutual';
import console from 'console-browserify'
import { ethers } from 'ethers';
import { assetsMapQuery } from '../../../../../utils/contractCalls';
import assetsDataStatic from '../../assetsData';

interface props {
  contractAddress: string
}

function FundCardsRealData({ contractAddress }: props) {

  // const { Moralis, isInitialized, isInitializing } = useMoralis();

  const [minimumUSDJoin, setMinimumUSDJoin] = useState('0')
  const [addresses, setAddresses] = useState([])
  const [assetsMap, setAssetsMap] = useState([])

  const [erc20Name, setErc20Name] = useState([])
  const [erc20Symbol, setErc20Symbol] = useState([])


  const [dataChart, setDataChart] = useState([])
  const [hovered, setHovered] = useState<number | undefined>(undefined);


  const {
    authenticate,
    isWeb3Enabled,
    isAuthenticated,
    enableWeb3,
    Moralis,
    isWeb3EnableLoading,
    provider
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
  }, [isAuthenticated, isWeb3Enabled]);


  useEffect(() => {
    if (isWeb3Enabled) {
      minimumUSDJoinQuery()
      assetQuantityQuery()
      erc20TokenName()
      erc20TokenSymbol()
    }
  }, [isWeb3Enabled]);


  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/${contractAddress}`;
    navigate(path);
  }

  async function minimumUSDJoinQuery() {
    const options = {
      contractAddress: contractAddress,
      functionName: "minimumUSDJoin",
      abi: mutual.abi,
    };
    const balanceOf = await Moralis.executeFunction(options);

    setMinimumUSDJoin(balanceOf.toString());
  }

  async function erc20TokenName() {
    const options = {
      contractAddress: contractAddress,
      functionName: "name",
      abi: mutual.abi,
    };
    const name: any = await Moralis.executeFunction(options);

    setErc20Name(name);
  }

  async function erc20TokenSymbol() {
    const options = {
      contractAddress: contractAddress,
      functionName: "symbol",
      abi: mutual.abi,
    };
    const symbol: any = await Moralis.executeFunction(options);

    setErc20Symbol(symbol);
  }

  async function assetQuantityQuery() {
    const options = {
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
    const options = {
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
      const address: any = await assetsMapQuery(contractAddress, addresses[i], provider)
      assetsMapDataArray.push(address)
    }


    setAssetsMap(assetsMapDataArray)
  }

  useEffect(() => {
    if (assetsMap && assetsMap.length > 0) {
      const chartData: any = assetsMap.map(assetContract => {
        console.log('assetContract', assetContract)

        const assetContractAddress = assetContract[0]

        console.log('assetContractAddress', assetContractAddress)


        const contractDataIndex = assetsDataStatic.findIndex(s => {
          console.log('s.symbol', s.symbol)
          console.log('s.address', s.address)

          return s.address.toUpperCase() === assetContractAddress.toUpperCase()
        })
        console.log('contractDataIndex', contractDataIndex)

        return { title: assetsDataStatic[contractDataIndex].symbol, value: assetContract[1], color: assetsDataStatic[contractDataIndex].color }
      })

      console.log('chartData', chartData)

      setDataChart(chartData)
    }


  }, [assetsMap])


  return (
    <Grid item xs={12} sm={4}>
      <Card sx={{ maxWidth: 345 }} onClick={routeChange}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                0x
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
          // title={`${fund.creator.substring(0, 4)}...${fund.creator.substring(37, 42)}`}
          // subheader={fund.createdAt}
          />
          <CardContent>
            <PieChart data={dataChart} style={{ height: '150px' }} animate
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={{
                fill: 'white',
                fontSize: '10px'
              }}
            />
          </CardContent>

          <CardContent>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Token Name: {erc20Name} ({erc20Symbol}) <br />
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <> Min to Join: {ethers.utils.formatEther(minimumUSDJoin)} USD</>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* {fund.shortDescription} */}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </CardActionArea>

      </Card>
    </Grid>
  )
}

export default FundCardsRealData;
