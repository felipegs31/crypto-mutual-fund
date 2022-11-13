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

function App() {
  return (
    <div>
      <Routes>
        <Route path='/:id' element={<Detail/>} />
        <Route path='/' element={<List/>} />
      </Routes>
    </div>
  );
}

export default App;
