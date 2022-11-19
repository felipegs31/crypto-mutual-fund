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

interface props {
  fund: any
}

function FundCardsV2({ fund }: props) {

  const [dataChart, setDataChart] = useState([])
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/m/${fund.id}`;
    navigate(path);
  }

  useEffect(() => {

    const data = fund.assets.map((asset: any) => {
      return { title: asset.symbol, value: asset.percentage, color: asset.color }
    })

    setDataChart(data)

  }, [fund])


  return (
    <Grid item xs={12} sm={4}>
      <Card sx={{ maxWidth: 345 }} onClick={routeChange}>
        <CardActionArea>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                Ox
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`${fund.creator.substring(0, 4)}...${fund.creator.substring(37, 42)}`}
            subheader={fund.createdAt}
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
              Token Name: {fund.tokenName} ({fund.tokenSymbol}) <br />
              Min to Join: {fund.minimumUSDToJoin} USD
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fund.shortDescription}
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

export default FundCardsV2;
