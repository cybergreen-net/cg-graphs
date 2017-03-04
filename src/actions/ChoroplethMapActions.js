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

export function fetchData(risk, date, test=false) {
  return function(dispatch) {
    dispatch(requestData(risk, date))
    let ENDPOINT = `/api/v1/count_by_country?limit=500&risk=${risk}&start=${date}&granularity=month`
    if(!test) {
      ENDPOINT = CG_API_ENDPOINT + ENDPOINT
    }
    return axios.get(ENDPOINT)
      .then(res => dispatch(receiveData(res.data.results, risk, date)))
      .catch(err => dispatch(receiveDataFailure(err.message, risk, date)))
  }
}
