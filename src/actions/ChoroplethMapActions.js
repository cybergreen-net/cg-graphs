/* global CG_API_ENDPOINT*/
import axios from 'axios'

export const FETCH_MAP_DATA_REQUEST = 'FETCH_MAP_DATA_REQUEST'

function requestData(risk, date) {
  return {
    type: FETCH_MAP_DATA_REQUEST,
    risk,
    date
  }
}

export const FETCH_MAP_DATA_SUCCESS = 'FETCH_MAP_DATA_SUCCESS'

function receiveData(data, risk, date) {
  return {
    type: FETCH_MAP_DATA_SUCCESS,
    data,
    risk,
    date
  }
}

export const FETCH_MAP_DATA_FAILURE = 'FETCH_MAP_DATA_FAILURE'

function receiveDataFailure(message, risk, date) {
  return {
    type: FETCH_MAP_DATA_FAILURE,
    error: message,
    risk,
    date
  }
}

export const SELECT_RISK_AND_DATE = 'SELECT_RISK_AND_DATE'
export function riskAndDateAreSelected(selectedRisk, selectedDate) {
  return {
    type: SELECT_RISK_AND_DATE,
    selectedRisk,
    selectedDate
  }
}

export function fetchData(risk, date, test = false) {
  return function(dispatch) {
    dispatch(requestData(risk, date))
    let ENDPOINT = `/api/v1/count_by_country?limit=500&risk=${risk}&start=${date}&end=${date}&granularity=week`
    if (!test) {
      ENDPOINT = CG_API_ENDPOINT + ENDPOINT
    }
    return axios.get(ENDPOINT)
      .then(res => dispatch(receiveData(res.data.results, risk, date)))
      .catch(err => dispatch(receiveDataFailure(err.message, risk, date)))
  }
}

export function shouldFetchData(state, risk, date) {
  const data = state.entities.cubeByRiskByDate[risk]
  if (!data || !data[date]) {
    return true
  } else {
    return false
  }
}

export function fetchDataIfNeeded(risk, date, test = false) {
  return (dispatch, getState) => {
    if (shouldFetchData(getState(), risk, date)) {
      return dispatch(fetchData(risk, date, test))
    } else {
      return Promise.resolve()
    }
  }
}
