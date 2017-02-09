import update from 'react/lib/update'
import {
  FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE,
  SELECT, SET_VIEWS
} from '../actions/cubeActions';

const initialState = {
  entities: {
    countries: {},
    risks: {},
    cubeByRiskByCountry: {}
  },
  views: {}
}

export function buildCube(state=initialState, action) {
  switch (action.type) {
    case FETCH_DATA_FAILURE:
      return update(state, {
        countryPerformanceOnRiskViews: {
          'gb/1' :{
            isFetched: {$set: false},
            isFetching: {$set: false},
            didFailed: {$set: true},
            errorMessage: {$set: action.error}
          }
        }
      })
    case FETCH_DATA_REQUEST:
      return update(state, {
        countryPerformanceOnRiskViews: {
          'gb/1' :{
            isFetched: {$set: false},
            isFetching: {$set: true},
            didFailed: {$set: false}
          }
        }
      })
    case FETCH_DATA_SUCCESS:
      let newState = update(state, {
        countryPerformanceOnRiskViews: {
          'gb/1' :{
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
        countryPerformanceOnRiskViews: {
          'gb/1': {
            selectorConfig: {
              $splice: [[action.idxOfSelector, 1,{
                disabled: false, country: action.selectedCountry
              }]]}
          }
        }
      })
    case SET_VIEWS:
      let views = {}
      action.viewOptions.risk.forEach(risk => {
        views[risk] = {
          type: action.viewOptions.type,
          country: action.viewOptions.country,
          risk: risk,
          isFetched: false,
          isFetching: false,
          didFailed: false,
          selectorConfig: [
            {disabled: true, country: action.viewOptions.country},
            {disabled: true, country: "t"},
            {disabled: false, country: undefined},
            {disabled: false, country: undefined},
            {disabled: false, country: undefined}
          ]
        }
      })
      return update(state, {
        views: {$set: views}
      })
    default:
      return state
  }
}
