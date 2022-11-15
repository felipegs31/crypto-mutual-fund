import header from './../../../images/header.webp';
import './index.css'
import Container from '@mui/material/Container';
import FundCards from './components/FundCards';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CreateFundModal from './components/CreateFundModal';
import funds from './fundsData';
import { useState } from 'react';

function List() {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <div>
      <CreateFundModal 
        open={open}
        onClose={handleClose}
      />
      <img src={header} alt="header" className="header-image" />
      <div className="middle">
        <Container maxWidth="md">
          <div className="create-button-container">
            <Button variant="contained" endIcon={<AddIcon />} onClick={handleOpen}>
              Create Mutual Fund
            </Button>
          </div>
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
