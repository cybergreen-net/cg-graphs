/* global graphData */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import CountryPerformanceOnRisk from './components/CountryPerformanceOnRisk';


let xValues = ['2017-01-01','2017-01-08','2017-01-15'];
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
    cubeByRiskByCountry: {
      1: {
        gb: [
          {
            "risk": 1,"country": "GB","date": "2017-01-16",
            "count": "11506","count_amplified": 4571746
          },
          {
            "risk": 1,"country": "GB","date": "2017-01-09",
            "count": "13330","count_amplified": 4646530
          },
          {
            "risk": 1,"country": "GB","date": "2017-01-02",
            "count": "11471","count_amplified": 4570311
          }
        ],
        ge: [
          {
            "risk": 1,"country": "GE","date": "2017-01-16",
            "count": "25712","count_amplified": 234192
          },
          {
            "risk": 1,"country": "GE","date": "2017-01-09",
            "count": "15898","count_amplified": 241818
          },
          {
            "risk": 1,"country": "GE","date": "2017-01-02",
            "count": "6324","count_amplified": 259284
          }
        ],
        kz: [
          {
            "risk": 1,"country": "KZ","date": "2017-01-16",
            "count": "29399","count_amplified": 1205359
          },
          {
            "risk": 1,"country": "KZ","date": "2017-01-09",
            "count": "30580","count_amplified": 1253780
          },
          {
            "risk": 1,"country": "KZ","date": "2017-01-02",
            "count": "27083","count_amplified": 1110403
          }
        ],
        us: [
          {
            "risk": 1,"country": "US","date": "2017-01-16",
            "count": "82772","count_amplified": 35373652
          },
          {
            "risk": 1,"country": "US","date": "2017-01-09",
            "count": "56717","count_amplified": 35125397
          },
          {
            "risk": 1,"country": "US","date": "2017-01-02",
            "count": "66268","count_amplified": 35516988
          },
        ],
        t: [
          {
            "risk": 1,"country": "T","date": "2017-01-16",
            "count": "81548","count_amplified": 156434762
          },
          {
            "risk": 1,"country": "T","date": "2017-01-09",
            "count": "33172","count_amplified": 157100602
          },
          {
            "risk": 1,"country": "T","date": "2017-01-02",
            "count": "32558","count_amplified": 156849067
          }
        ]
      }
    },
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
  defaultCountry: {value: 'gb', label: 'United Kingdom' }
}

const reducer = (state, action) => {
  return state
}

let store = createStore(reducer, reduxStore)

ReactDOM.render(
  <Provider store={store}>
    <CountryPerformanceOnRisk/>
  </Provider>,
  document.getElementById('root')
);
