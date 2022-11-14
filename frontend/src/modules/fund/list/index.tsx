import header from './../../../images/header.webp';
import './index.css'
import Container from '@mui/material/Container';
import FundCards from './components/FundCards';

import Paper from '@mui/material/Paper';

function List() {

  const funds = [{
    id: '1',
    creator: '0x33332f2550C2968d0690D1946ca70C34cA80e081',
    assets: [
      {
        address: '0xD10aBbC76679a20055E167BB80A24ac851b37056',
        startPercentage: 0,
        percentage: 40,
        balance: '10000000000000000000',
        name: 'APE Coin',
        symbol: 'APE',
        image: 'https://assets.coingecko.com/coins/images/24383/thumb/apecoin.jpg?1647476455'
      },
      {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        startPercentage: 40,
        percentage: 30,
        balance: '30000000000000000000',
        name: 'Dai',
        symbol: 'DAI',
        image: 'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734'
      },
      {
        address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        startPercentage: 70,
        percentage: 20,
        balance: '30000000000000000000',
        name: 'Uniswap',
        symbol: 'UNI',
        image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604'
      },
      {
        address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        startPercentage: 90,
        percentage: 10,
        balance: '2000000000000000000',
        name: 'Aave',
        symbol: 'AAVE',
        image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110'
      }
    ],
    tokenName: 'CF Fund',
    tokenSymbol: 'CFX',
    minimumUSDToJoin: '20',
    totalValueInTheFund: '123123',
    shortDescription: 'A fund that balances stable coins with DeFi, thought for people that want to receive a good APY',
  }, {
    id: '2',
    creator: '0x33332f2550C2968d0690D1946ca70C34cA80e081',
    assets: [
      {
        address: '0xD10aBbC76679a20055E167BB80A24ac851b37056',
        startPercentage: 0,
        percentage: 40,
        balance: '10000000000000000000',
        name: 'APE Coin',
        symbol: 'APE',
        image: 'https://assets.coingecko.com/coins/images/24383/thumb/apecoin.jpg?1647476455'
      },
      {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        startPercentage: 40,
        percentage: 30,
        balance: '30000000000000000000',
        name: 'Dai',
        symbol: 'DAI',
        image: 'https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734'
      },
      {
        address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        startPercentage: 70,
        percentage: 20,
        balance: '30000000000000000000',
        name: 'Uniswap',
        symbol: 'UNI',
        image: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604'
      },
      {
        address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        startPercentage: 90,
        percentage: 10,
        balance: '2000000000000000000',
        name: 'Aave',
        symbol: 'AAVE',
        image: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110'
      }
    ],
    tokenName: 'CF Fund',
    tokenSymbol: 'CFX',
    minimumUSDToJoin: '20',
    totalValueInTheFund: '123123',
    shortDescription: 'A fund that balances stable coins with DeFi, thought for people that want to receive a good APY',
  }]

  return (
    <div>
      <img src={header} alt="header" className="header-image" />
      <div className="middle">
        <Container maxWidth="md" >
          <Paper>
            hey
          </Paper>
          {funds.map(fund => <FundCards fund={fund} key={fund.id}/>) }
        </Container>
      </div>

    </div>
  );
}

export default List;
