/* global graphData */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { buildCube } from './reducers/cubeReducers';

import CountryPerformanceOnRisk from './components/CountryPerformanceOnRisk';


let reduxStore = {
  entities: {
    countries: {
      '': {title: 'Select a country'},
      't': {title: 'Global'},
      'ge': {title: 'Georgia'},
      'kz': {title: 'Kazakhstan'},
      'gb': {title: 'United Kingdom'},
      'us': {title: 'United States'}
    },
    risks: {
      1: {title: 'Open DNS'},
      2: {title: 'Open NTP'},
      4: {title: 'Open SNMP'},
      5: {title: 'Open SSDP'},
      6: {title: 'Open Mirai'},
      100: {title: 'DDOS'}
    },
    cubeByRiskByCountry: {},
    layouts: {
      l1: {
        title : 'Open DNS',
        height: 600,
        xaxis: {
          gridcolor: 'transparent',
        },
        yaxis: {
          title: 'GBit/sec'
        }
      }
    }
  },
  views: {
    1: {
      type: "country/performance",
      country: "gb",
      risk: 1,
      isFetched: false,
      isFetching: false,
      didFailed: false,
      selectorConfig: [
        {disabled: true, country: "gb"},
        {disabled: true, country: "t"},
        {disabled: false, country: undefined},
        {disabled: false, country: undefined},
        {disabled: false, country: undefined}
      ]
    }
  }
}


let store = createStore(
  buildCube,
  reduxStore,
  applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={store}>
    <CountryPerformanceOnRisk/>
  </Provider>,
  document.getElementById('root')
);
