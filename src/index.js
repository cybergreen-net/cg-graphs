/* global graphData countries countryPerformanceOnRiskViews asn tempData risks*/
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
    risks: risks,
    asn: asn,
    cubeByRiskByCountry: {},
    cubeByRiskByAS: tempData,
    layouts: {
      legend: {x:0, y:1},
      height: 200,
      margin: {
        l: 40,r: 30,
        b: 30,t: 0
      },
      xaxis: {
        gridcolor: 'transparent',
      },
      yaxis: {
        title: 'Normalized counts'
      },
      font: {
        size: 9,
        color: '#7f7f7f'
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
