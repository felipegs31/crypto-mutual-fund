import { Container, Grid, Paper } from "@mui/material";
import Chart from "./components/Chart";
import Deposits from "./components/Deposits";
import Orders from "./components/Transactions";
import Widget from "./components/Widget";

function DetailMock() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Widget title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Widget title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Widget title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Widget title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
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
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Deposits />
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DetailMock;
