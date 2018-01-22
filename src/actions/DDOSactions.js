import axios from 'axios'

export const FETCH_RISK_REQUEST = 'FETCH_RISK_REQUEST'

function requestRisk(risk) {
  return {
    type: FETCH_RISK_REQUEST,
    risk
  }
}

export const FETCH_RISK_SUCCESS = 'FETCH_RISK_SUCCESS'

function receivetRisk(data, risk) {
  return {
    type: FETCH_RISK_SUCCESS,
    data,
    risk
  }
}

export const FETCH_RISK_FAILURE = 'FETCH_RISK_FAILURE'

function receivetRiskFailure(message, risk) {
  return {
    type: FETCH_RISK_FAILURE,
    error: message,
    risk
  }
}

export function fetchRisk(risk) {
  return function(dispatch) {
    dispatch(requestRisk(risk))
    return axios.get(`/api/count_by_country?limit=500&country=T&risk=${risk}`)
      .then(res => dispatch(receivetRisk(res.data.results, risk)))
      .catch(err => dispatch(receivetRiskFailure(err.message, risk)))
  }
}
