import {
  FETCH_RISK_REQUEST,
  FETCH_RISK_SUCCESS,
  FETCH_RISK_FAILURE
} from '../actions/DDOSactions';

export function risks(state = {
  isFetching: false,
  isFetched: false,
  didFailed: false,
  data: {}
}, action) {
  switch (action.type) {
    case FETCH_RISK_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case FETCH_RISK_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isFetched: true,
        didFailed: false,
        data: action.data
      })
    case FETCH_RISK_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didFailed: true,
        errorMessage: action.error
      })
    default:
      return state
  }
}

export function countByRisk(state = {}, action) {
  switch (action.type) {
    case FETCH_RISK_FAILURE:
    case FETCH_RISK_SUCCESS:
    case FETCH_RISK_REQUEST:
      return Object.assign({}, state, {
        [action.risk]: risks(state[action.risk], action)
      })
    default:
      return state
  }
}
