/* global graphData */
import React from 'react';
import ReactDOM from 'react-dom';
import CountryPerformanceOnRisk from './components/CountryPerformanceOnRisk';


// graphData (List of urls to API endpoints) should be passed from server
ReactDOM.render(
  <CountryPerformanceOnRisk urls={graphData || []}/>,
  document.getElementById('root')
);
