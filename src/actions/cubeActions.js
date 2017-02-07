import axios from 'axios'

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
function requestData(country, risk) {
  return {
    type: FETCH_DATA_REQUEST,
    country,
    risk
  }
}

export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
function receivetData(data, country, risk) {
  return {
    type: FETCH_DATA_SUCCESS,
    data,
    country,
    risk
  }
}

export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE'
function receivetDataFailure(message, country, risk) {
  return {
    type: FETCH_DATA_FAILURE,
    error: message,
    country,
    risk
  }
}

export function fetchData(country, risk) {
  return function(dispatch) {
    dispatch(requestData(country, risk))
    return axios.get(`/api/count_by_country?limit=500&country=${country}&risk=${risk}`)
      .then(res => dispatch(receivetData(res.data.results, country, risk)))
      .catch(err => dispatch(receivetDataFailure(err.message, country, risk)))
  }
}
