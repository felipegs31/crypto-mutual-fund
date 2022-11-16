import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './index.css'
import Avatar from '@mui/material/Avatar';
import randomColor from 'randomcolor'
import Chart from '../../../../../designSystem/Chart';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

interface props {
  fund: any
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function FundCards({ fund }: props) {
  return (
    <Paper sx={{
      borderRadius: 5
    }}>
      <div className="card-header">
        <div></div>
        <div>Fund By {`${fund.creator.substring(0, 4)}...${fund.creator.substring(37, 42)}`}</div>
        <div>Token: {fund.tokenSymbol}</div>
      </div>
      <div className="card-container">
        <Grid item xs={12}>
          <p>{fund.shortDescription}</p>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Item elevation={2}>
              Value in Contract: <br /> 1231,32 USD
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item elevation={2}>
              Shares issued: <br /> 12313,23
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item elevation={2}>
              Wallets with tokens: <br /> 1231
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item elevation={2}>
              Number of Assets: <br /> 4
            </Item>
          </Grid>
        </Grid>
        <div style={{ marginTop: 20 }}>
          {/* <Grid container spacing={12} >
            <Grid item xs={2}></Grid>
            <Grid item xs={4}>
              {fund.assets.map((asset: any) =>
                <Grid container spacing={3} key={asset.address}>
                  <Grid item xs={4}>
                    <div className="logo-name-container">
                      <Avatar src={asset.image} sx={{ width: 24, height: 24 }}></Avatar>
                      <span className="logo-name">{asset.symbol}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <Slider
                      size="small"
                      getAriaLabel={() => 'Percentage Range'}
                      value={[asset.startPercentage, asset.startPercentage + asset.percentage]}
                      valueLabelDisplay="auto"
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <span className='percentage'>{asset.percentage}%</span>
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Grid item xs={4}>
              <Chart />
            </Grid>
            <Grid item xs={2}></Grid>

          </Grid> */}
        </div>
      </div>
    </Paper>
  );
}

export default FundCards;
