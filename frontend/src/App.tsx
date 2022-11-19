import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Detail from './modules/fund/detail';
import List from './modules/fund/list';
import { ConnectButton } from '@web3uikit/web3';

function App() {
  return (
    <div className=''>
      <div className='app-header'>
        Crypto Mutual Fund 
        <ConnectButton></ConnectButton>
      </div>
      <Routes>
        <Route path='/m/:id' element={<Detail/>} />
        <Route path='/:id' element={<Detail/>} />
        <Route path='/' element={<List/>} />
      </Routes>
    </div>
  );
}

export default App;
