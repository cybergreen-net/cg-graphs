/* global CG_API_ENDPOINT*/
import axios from 'axios'

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
function requestData(country, risk, graphId) {
  return {
    type: FETCH_DATA_REQUEST,
    country,
    risk,
    graphId
  }
}

export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
function receivetData(data, country, risk, graphId) {
  return {
    type: FETCH_DATA_SUCCESS,
    data,
    country,
    risk,
    graphId
  }
}

export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE'
function receivetDataFailure(message, country, risk, graphId) {
  return {
    type: FETCH_DATA_FAILURE,
    error: message,
    country,
    risk,
    graphId
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

export function fetchData(country, risk, graphId, test=false) {
  return function(dispatch) {
    dispatch(requestData(country, risk, graphId))
    let ENDPOINT = `/api/v1/count_by_country?limit=500&country=${country}&risk=${risk}&drilldown=as&drilldown_limit=5`
    if(!test) {
      ENDPOINT = CG_API_ENDPOINT + ENDPOINT
    }
    return axios.get(ENDPOINT)
      .then(res => dispatch(receivetData(res.data.results, country, risk, graphId)))
      .catch(err => dispatch(receivetDataFailure(err.message, country, risk, graphId)))
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

export function fetchDataIfNeeded(country, risk, graphId, test=false) {
  return (dispatch, getState) => {
    if (shouldFetchData(getState(), country, risk)) {
      return dispatch(fetchData(country, risk, graphId, test))
    } else {
      return Promise.resolve()
    }
  }
}

export const SET_VIEWS = 'SET_VIEWS'
export function setViews(viewOptions) {
  return {
    type: SET_VIEWS,
    viewOptions
  }
}
