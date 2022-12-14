import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  type: string,
  amount: number,
) {
  return { id, date, name, type, amount };
}

const rows = [
  createData(
    0,
    '16 Mar, 2022',
    '0xf39F....92266',
    'BUY',
    312.44,
  ),
  createData(
    1,
    '16 Mar, 2022',
    '0xf39F....92266',
    'BUY',
    866.99,
  ),
  createData(2, '16 Mar, 2022', '0xf39F....92266', 'SELL', 100.81),
  createData(
    3,
    '16 Mar, 2022',
    '0xf39F....92266',
    'BUY',
    654.39,
  ),
  createData(
    4,
    '15 Mar, 2022',
    '0xf39F....92266',
    'SELL',
    212.79,
  ),
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Orders() {
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>Recent Trasactions</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Wallet</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell align="right">{`$${row.amount}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
