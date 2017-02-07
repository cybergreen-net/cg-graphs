import update from 'react/lib/update'
import {
  FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, SELECT
} from '../actions/cubeActions';

const initialState = {
  entities: {
    countries: {},
    risks: {},
    cubeByRiskByCountry: {}
  },
  views: { 1: {} }
}

export function buildCube(state=initialState, action) {
  switch (action.type) {
    case FETCH_DATA_FAILURE:
      return update(state, {
        views: {
          1 :{
            type: {$set: 'country/performance'},
            risk: {$set: action.risk}, country: {$set: action.country},
            isFetched: {$set: false},
            isFetching: {$set: false},
            didFailed: {$set: true},
            errorMessage: {$set: action.error}
          }
        }
      })
    case FETCH_DATA_REQUEST:
      return update(state, {
        views: {
          1 :{
            type: {$set: 'country/performance'},
            risk: {$set: action.risk}, country: {$set: action.country},
            isFetched: {$set: false},
            isFetching: {$set: true},
            didFailed: {$set: false}
          }
        }
      })
    case FETCH_DATA_SUCCESS:
      let newState = update(state, {
        views: {
          1 :{
            type: {$set: 'country/performance'},
            risk: {$set: action.risk}, country: {$set: action.country},
            isFetched: {$set: true},
            isFetching: {$set: false},
            didFailed: {$set: false}
          }
        }
      })
      return Object.assign({}, newState, {
          entities: Object.assign(
              {}, state.entities, {
                cubeByRiskByCountry: Object.assign(
                  {}, state.entities.cubeByRiskByCountry,{[action.risk]: Object.assign(
                    {}, state.entities.cubeByRiskByCountry[action.risk], {
                      [action.country]: action.data}
                  )
                }
              )
            }
          )
        }
      )
    case SELECT:
      return update(state, {
        views: {
          1: {
            selectorConfig: {
              $splice: [[action.idxOfSelector, 1,{
                disabled: false, country: action.selectedCountry
              }]]}
          }
        }
      })
    default:
      return state
  }
}
