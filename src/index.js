/* global graphData */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { buildCube } from './reducers/cubeReducers';

import CountryPerformanceOnRisk from './components/CountryPerformanceOnRisk';
import Dropdown from './components/Dropdown';
import App from './components/App';


let reduxStore = {
  entities: {
    countries: {
      't': {id: 't', name: 'Global', slug: ''},
      'ge': {id: 'ge', name: 'Georgia', slug: 'georgia'},
      'kz': {id: 'kz', name: 'Kazakhstan', slug: 'Kazakhstan'},
      'gb': {id: 'gb', name: 'United Kingdom', slug: 'united-kingdom'},
      'us': {id: 'us', name: 'United States', slug: 'united-states'}
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
  views: {}
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  buildCube,
  reduxStore,
  composeEnhancers(applyMiddleware(thunk))
)

ReactDOM.render(
  <Dropdown countries={reduxStore.entities.countries}/>,
  document.getElementById('dropdown')
);


ReactDOM.render(
  <App urls={graphData || []}/>,
  document.getElementById('ddos')
);

const serverProps = {country: 'gb', risk: [1], type: 'country/performance'}

ReactDOM.render(
  <Provider store={store}>
    <CountryPerformanceOnRisk serverProps={serverProps}/>
  </Provider>,
  document.getElementById('root')
);
