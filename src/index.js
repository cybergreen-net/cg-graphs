/* global graphData */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';


// graphData (List of urls to API endpoints) should be passed from server
ReactDOM.render(
  <App urls={graphData || []}/>,
  document.getElementById('root')
);