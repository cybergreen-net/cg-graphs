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
      title: 'dns-graph',
      dataToshow: ['uk1','t1'],
      graphLayout: ['l1']
    }
  },
  entities: {
    countries: {
      '': {title: 'Select a country'},
      'T': {title: 'Global'},
      'GE': {title: 'Georgia'},
      'KZ': {title: 'Kazakhstan'},
      'UK': {title: 'United Kingdom'},
      'US': {title: 'United States'}
    },
    risks: {
      1: {title: 'Open DNS'},
      2: {title: 'Open NTP'},
      4: {title: 'Open SNMP'},
      5: {title: 'Open SSDP'},
      6: {title: 'Open Mirai'},
      100: {title: 'DDOS'}
    },
    data: [
      {
        id: 'uk1',
        x: xValues,
        y: [2,4,6],
        name: 'United Kingdom',
        type: 'scatter'
      },
      {
        id: 't1',
        x: xValues,
        y: [1,4,7],
        name: 'Global',
        type: 'scatter'
      },
      {
        id: 'us1',
        x: xValues,
        y: [6,3,2],
        name: 'United States',
        type: 'scatter'
      },
      {
        id: 'ge1',
        x: xValues,
        y: [5,12,1],
        name: 'Georgia',
        type: 'scatter'
      },
      {
        id: 'kz1',
        x: xValues,
        y: [0,12,10],
        name: 'Kazakstan',
        type: 'scatter'
      }
    ],
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
  defaultCountry: {value: 'uk', label: 'United Kingdom' }
}

const reducer = (state, action) => {
  // makes new copy of list, for not to mutate previous state
  let newDataToShow = state.graphs[1].dataToshow
  newDataToShow[action.idx] = action.id

  switch(action.type) {
    case 'addRemoveLine':
      return {...state,
        graphs: {
          1: {
            title: 'dns-graph',
            dataToshow: Object.assign(
              [],
              state.graphs[1].dataToshow,
              newDataToShow
            ),
            graphLayout: ['l1']
          }
        }
      }
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
