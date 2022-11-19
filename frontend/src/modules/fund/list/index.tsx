import logo from './../../../images/logo.png';
import './index.css'
import Container from '@mui/material/Container';
import FundCards from './components/FundCards';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CreateFundModal from './components/CreateFundModal';
import funds from './fundsData';
import { useEffect, useState } from 'react';
import { useMoralisQuery, useMoralis } from "react-moralis"
import FundCardsV2 from './components/FundCardsV2';
import { Grid } from '@mui/material';
import console from 'console-browserify'
import FundCardsRealData from './components/FundCardsRealData';

function List() {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { isWeb3Enabled } = useMoralis()
  const [contracts, setContracts] = useState([])

  useEffect(() => {
    const contracts = localStorage.getItem("contracts");
    console.log('contracts', contracts)
    if (contracts) {
      setContracts(JSON.parse(contracts))
    }
  }, [])

  return (
    <div>
      {open && <CreateFundModal
        open={open}
        onClose={handleClose}
      />}
      <div style={{
        backgroundColor: '#f1f1f1',
        textAlign: 'center'
      }}>
        <img src={logo} alt="header" className="header-image" />
      </div>
      <div className="middle">
        <Container maxWidth="lg">
          {isWeb3Enabled && <div className="create-button-container">
            <Button variant="contained" endIcon={<AddIcon />} onClick={handleOpen}>
              Create Mutual Fund
            </Button>
          </div>}
          <Grid
            container
            spacing={2}
          >
            {contracts.map(address => <FundCardsRealData contractAddress={address} key={address} />)}

            {funds.map(fund => <FundCardsV2 fund={fund} key={fund.id} />)}
          </Grid>
        </Container>
      </div>

    </div>
  );
}

export default List;
