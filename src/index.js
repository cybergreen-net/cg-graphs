import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const fixtures = [
  {
    url: './fixtures/dns.json',
    name: 'Open Recursive DNS'
  },
  {
    url: './fixtures/ntp.json',
    name: 'Open NTP'
  },
  {
    url: './fixtures/snmp.json',
    name: 'Open SNMP'
  },
  {
    url: './fixtures/ssdp.json',
    name: 'Open SSDP'
  }
]

// graphData (List of urls to API endpoints) should be passed from server

const data = fixtures;

ReactDOM.render(
  <App urls={data}/>,
  document.getElementById('root')
);
