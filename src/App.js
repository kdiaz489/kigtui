import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidenav from './Components/Sidenav.js';
import Chart from  './Components/revChart.js';

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <Sidenav />
        <div id="content">
          
          <Chart title = "CHARGING UTILIZATION REVENUE" />
          <Chart title = "UTILITY USAGE" />
          <Chart title = "POWER FLOW" />
          <Chart title="CHARGING DIRECTION" />
        </div>
      </div>
        
    );
  }
}

export default App;
