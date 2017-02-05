/* global graphData */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import CountryPerformanceOnRisk from './components/CountryPerformanceOnRisk';


let xValues = ['2017-01-01','2017-01-08','2017-01-15'];
let reduxStore = {
  graphs: {
    1: {
      title: 'DDOS-graph',
      dataToshow: ['t1','t2'],
      graphLayout: ['l1']
    }
  },
  entities: {
    data: [
      {
        x: xValues,
        y: [2,4,6],
        name: 'example N1',
        type: 'scatter'
      },
      {
        x: xValues,
        y: [1,4,7],
        name: 'example N2',
        type: 'scatter'
      }
    ],
    layouts: {
      l1: {
        title : 'Global DDOS potential',
        height: 600,
        xaxis: {
          title: '*This chart assumes an average 1 mbit/sec Internet connection for every IP address.',
          gridcolor: 'transparent',
        },
        yaxis: {
          title: 'GBit/sec'
        }
      }
    },
    countries: [
      {value: '', label: 'Select a country'},
      {value: 'uk', label: 'United Kingdom' },
      {value: 'us', label: 'United States' },
      {value: 'ge', label: 'Georgia' },
    ]
  },
  defaultCountry: {value: 'uk', label: 'United Kingdom' }
}
const reducer = function(state, action) {
  switch(action.type) {
    default:
      return state
  }
}
let store = createStore(reducer, reduxStore)

ReactDOM.render(
  <Provider store={store}>
    <CountryPerformanceOnRisk/>
  </Provider>,
  document.getElementById('root')
);
