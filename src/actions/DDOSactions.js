import axios from 'axios'

export const FETCH_RISK_REQUEST = 'FETCH_RISK_REQUEST'
function requestRisk() {
  return {
    type: FETCH_RISK_REQUEST
  }
}

export const FETCH_RISK_SUCCESS = 'FETCH_RISK_SUCCESS'
function receivetRisk(data) {
  return {
    type: FETCH_RISK_SUCCESS,
    data
  }
}

export const FETCH_RISK_FAILURE = 'FETCH_RISK_FAILURE'
function receivetRiskFailure(message) {
  return {
    type: FETCH_RISK_FAILURE,
    error: message
  }
}

export function fetchRisk(risk) {
  return function(dispatch) {
    dispatch(requestRisk())
    return axios.get('/api/count?risk='+risk+'&country=t&limit=500')
      .then(res => dispatch(receivetRisk(res.data.results)))
      .catch(err => dispatch(receivetRiskFailure(err.message)))
  }
}
