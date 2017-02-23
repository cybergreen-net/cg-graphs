import update from 'react/lib/update'
import {
  FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE, SELECT
} from '../actions/cubeActions';
import {
  FETCH_AS_DATA_REQUEST,FETCH_AS_DATA_SUCCESS,FETCH_AS_DATA_FAILURE,SELECT_AS
} from '../actions/ASactions';

const initialState = {
  entities: {
    countries: {},
    risks: {},
    asn: {},
    cubeByRiskByCountry: {},
    cubeByRiskByASN: {}
  },
  countryPerformanceOnRiskViews: {},
  ASPerformanceViews: {}
}

export function buildCube(state=initialState, action) {
  switch (action.type) {
    case FETCH_DATA_FAILURE:
      return update(state, {
        countryPerformanceOnRiskViews: {
          [action.graphId] :{
            isFetched: {$set: false},
            isFetching: {$set: state.countryPerformanceOnRiskViews[action.graphId].isFetching + 1},
            didFailed: {$set: true},
            errorMessage: {$set: action.error}
          }
        }
      })
    case FETCH_DATA_REQUEST:
      return update(state, {
        countryPerformanceOnRiskViews: {
          [action.graphId] :{
            isFetched: {$set: false},
            isFetching: {$set: state.countryPerformanceOnRiskViews[action.graphId].isFetching - 1},
            didFailed: {$set: false}
          }
        }
      })
    case FETCH_DATA_SUCCESS:
      let newState = update(state, {
        countryPerformanceOnRiskViews: {
          [action.graphId] :{
            isFetched: {$set: true},
            isFetching: {$set: state.countryPerformanceOnRiskViews[action.graphId].isFetching + 1},
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
        countryPerformanceOnRiskViews: {
          [action.graphId]: {
            selectorConfig: {
              $splice: [[action.idxOfSelector, 1,{
                disabled: false, country: action.selectedCountry
              }]]}
          }
        }
      })
    case FETCH_AS_DATA_FAILURE:
      return update(state, {
        ASPerformanceViews: {
          [action.graphId] :{
            isFetched: {$set: false},
            isFetching: {$set: state.ASPerformanceViews[action.graphId].isFetching + 1},
            didFailed: {$set: true},
            errorMessage: {$set: action.error}
          }
        }
      })
    case FETCH_AS_DATA_REQUEST:
      return update(state, {
        ASPerformanceViews: {
          [action.graphId] :{
            isFetched: {$set: false},
            isFetching: {$set: state.ASPerformanceViews[action.graphId].isFetching - 1},
            didFailed: {$set: false}
          }
        }
      })
    case FETCH_AS_DATA_SUCCESS:
      let updateState = update(state, {
        ASPerformanceViews: {
          [action.graphId] :{
            isFetched: {$set: true},
            isFetching: {$set: state.ASPerformanceViews[action.graphId].isFetching + 1},
            didFailed: {$set: false}
          }
        }
      })
      return Object.assign({}, updateState, {
          entities: Object.assign(
              {}, state.entities, {
                cubeByRiskByASN: Object.assign(
                  {}, state.entities.cubeByRiskByASN, {
                    [action.country+'/'+action.risk+'/'+action.AsId]: action.data
                  }
              )
            }
          )
        }
      )
    case SELECT_AS:
      return update(state, {
        ASPerformanceViews: {
          [action.graphId]: {
            selectorConfig: {
              $splice: [[action.idxOfSelector, 1,{
                disabled: false, as: action.selectedAS
              }]]}
          }
        }
      })
    default:
      return state
  }
}
