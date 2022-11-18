import logo from './../../../images/logo.png';
import './index.css'
import Container from '@mui/material/Container';
import FundCards from './components/FundCards';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CreateFundModal from './components/CreateFundModal';
import funds from './fundsData';
import { useState } from 'react';
import { useMoralisQuery, useMoralis } from "react-moralis"
import FundCardsV2 from './components/FundCardsV2';
import { Grid } from '@mui/material';

function List() {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { isWeb3Enabled } = useMoralis()

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
            {funds.map(fund => <FundCardsV2 fund={fund} key={fund.id} />)}
          </Grid>
        </Container>
      </div>

    </div>
  );
}

export default List;
