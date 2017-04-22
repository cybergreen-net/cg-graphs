/* global CG_API_ENDPOINT*/
import axios from 'axios'

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
function requestData(country, risk, graphId, viewType='countryPerformanceOnRiskViews') {
  return {
    type: FETCH_DATA_REQUEST,
    country,
    risk,
    graphId,
    viewType
  }
}

export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
function receivetData(data, country, risk, graphId, viewType='countryPerformanceOnRiskViews') {
  return {
    type: FETCH_DATA_SUCCESS,
    data,
    country,
    risk,
    graphId,
    viewType
  }
}

export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE'
function receivetDataFailure(message, country, risk, graphId, viewType='countryPerformanceOnRiskViews') {
  return {
    type: FETCH_DATA_FAILURE,
    error: message,
    country,
    risk,
    graphId,
    viewType
  }
}

export const SELECT = 'SELECT'
export function countryIsSelected(idxOfSelector, selectedCountry, graphId) {
  return {
    type: SELECT,
    idxOfSelector,
    selectedCountry,
    graphId
  }
}

export function fetchData(country, risk, graphId, viewType, test=false) {
  return function(dispatch) {
    dispatch(requestData(country, risk, graphId, viewType))
    let ENDPOINT = `/api/v1/count_by_country?limit=500&country=${country}&risk=${risk}&drilldown=as&drilldown_limit=5`
    if(!test) {
      ENDPOINT = CG_API_ENDPOINT + ENDPOINT
    }
    return axios.get(ENDPOINT)
      .then(res => dispatch(receivetData(res.data.results, country, risk, graphId, viewType)))
      .catch(err => dispatch(receivetDataFailure(err.message, country, risk, graphId, viewType)))
  }
}

export function shouldFetchData(state, country, risk) {
  const data = state.entities.cubeByRiskByCountry[risk]
  if (!data || !data[country]) {
    return true
  } else {
    return false
  }
}

export function fetchDataIfNeeded(country, risk, graphId, viewType, test=false) {
  return (dispatch, getState) => {
    if (shouldFetchData(getState(), country, risk)) {
      return dispatch(fetchData(country, risk, graphId, viewType, test))
    } else {
      return Promise.resolve()
    }
  }
}

export const GET_RANK_SUCCESS = 'GET_RANK_SUCCESS'
function receiveRank(data, country, risk, graphId, viewType='countryPerformanceOnRiskViews') {
  return {
    type: GET_RANK_SUCCESS,
    data,
    country,
    risk,
    graphId,
    viewType
  }
}

export function getCountryRanking(country, risk, graphId, test=false) {
  return function(dispatch) {
    dispatch(requestData(country, risk, graphId))
    let ENDPOINT = `/api/v1/rankings?risk=${risk}&country=${country}&granularity=week`
    if(!test) {
      ENDPOINT = CG_API_ENDPOINT + ENDPOINT
    }
    return axios.get(ENDPOINT)
      .then(res => dispatch(receiveRank(res.data.results, country, risk, graphId)))
      .catch(err => dispatch(receivetDataFailure(err.message, country, risk, graphId)))
  }
}

export const CHANGE_MEASURE = 'CHANGE_MEASURE'
export function changeMeasure(measure, graphId, viewType='countryPerformanceOnRiskViews') {
  return {
    type: CHANGE_MEASURE,
    measure,
    graphId,
    viewType
  }
}
