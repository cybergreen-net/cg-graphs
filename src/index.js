/* global graphData countries countryPerformanceOnRiskViews asn risks ASPerformanceViews DdosPerformanceViews ChoroplethMapViews*/
import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import {
  createStore,
  applyMiddleware,
  compose
}
from 'redux';
import thunk from 'redux-thunk';
import {
  Provider
}
from 'react-redux';
import {
  buildCube
}
from './reducers/cubeReducers';

import CountryPage from './components/CountryPage';
import ASPage from './components/ASPage';
import RiskPage from './components/RiskPage';

import FrontPageCountrySelector from './components/FrontPageCountrySelector';
import DdosPerformance from './components/DdosPerformance';
import ChoroplethMap from './components/ChoroplethMap';



let reduxStore = {
  entities: {
    countries: countries,
    risks: risks,
    asn: asn,
    cubeByRiskByCountry: {},
    cubeByRiskByASN: {},
    cubeByRiskByDate: {},
    layouts: {
      legend: {
        x: 0,
        y: 1
      },
      height: 200,
      margin: {
        l: 40,
        r: 30,
        b: 30,
        t: 0
      },
      xaxis: {
        gridcolor: 'transparent',
      },
      yaxis: {
        title: 'Count of infected devices'
      },
      font: {
        size: 9,
        color: '#7f7f7f'
      },
    }
  },
  countryPerformanceOnRiskViews: countryPerformanceOnRiskViews,
  ASPerformanceViews: ASPerformanceViews,
  DdosPerformanceViews: DdosPerformanceViews,
  ChoroplethMapViews: ChoroplethMapViews
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  buildCube,
  reduxStore,
  composeEnhancers(applyMiddleware(thunk))
)

if (document.getElementById('dropdown')) {
  ReactDOM.render( <
    FrontPageCountrySelector countries = {
      reduxStore.entities.countries
    }
    />,
    document.getElementById('dropdown')
  );
}

if (document.getElementById('ChoroplethMap')) {
  ReactDOM.render( <
    Provider store = {
      store
    } >
    <
    ChoroplethMap / >
    <
    /Provider>,
    document.getElementById('ChoroplethMap')
  );
}

if (document.getElementById('ddos')) {
  ReactDOM.render( <
    Provider store = {
      store
    } >
    <
    DdosPerformance / >
    <
    /Provider>,
    document.getElementById('ddos')
  );
}

if (document.getElementById('countryPerformance')) {
  ReactDOM.render( <
    Provider store = {
      store
    } >
    <
    CountryPage / >
    <
    /Provider>,
    document.getElementById('countryPerformance')
  );
}

if (document.getElementById('ASPerformance')) {
  ReactDOM.render( <
    Provider store = {
      store
    } >
    <
    ASPage / >
    <
    /Provider>,
    document.getElementById('ASPerformance')
  );
}

if (document.getElementById('riskPerformance')) {
  ReactDOM.render( <
    Provider store = {
      store
    } >
    <
    RiskPage / >
    <
    /Provider>,
    document.getElementById('riskPerformance')
  );
}
