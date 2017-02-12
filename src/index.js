/* global graphData countries countryPerformanceOnRiskViews*/
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { buildCube } from './reducers/cubeReducers';

import CountryPage from './components/CountryPage';

import FrontPageCountrySelector from './components/FrontPageCountrySelector';
import DdosPerformance from './components/DdosPerformance';


let reduxStore = {
  entities: {
    countries: countries,
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
      legend: {x:0, y:1},
      height: 200,
      margin: {
        l: 0,r: 5,
        b: 30,t: 0,
      },
      xaxis: {
        gridcolor: 'transparent',
      }
    }
  },
  countryPerformanceOnRiskViews: countryPerformanceOnRiskViews
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  buildCube,
  reduxStore,
  composeEnhancers(applyMiddleware(thunk))
)

if (document.getElementById('dropdown')) {
  ReactDOM.render(
    <FrontPageCountrySelector countries={reduxStore.entities.countries}/>,
    document.getElementById('dropdown')
  );
}

if (document.getElementById('ddos')){
  ReactDOM.render(
    <DdosPerformance urls={graphData || []}/>,
    document.getElementById('ddos')
  );
}

if (document.getElementById('root')) {
  ReactDOM.render(
    <Provider store={store}>
      <CountryPage />
    </Provider>,
    document.getElementById('root')
  );
}
