/* global CG_API_ENDPOINT*/
import axios from 'axios'

export const FETCH_AS_DATA_REQUEST = 'FETCH_AS_DATA_REQUEST'
function requestAsData(country, risk, AsId, graphId) {
  return {
    type: FETCH_AS_DATA_REQUEST,
    country,
    risk,
    AsId,
    graphId
  }
}

export const FETCH_AS_DATA_SUCCESS = 'FETCH_AS_DATA_SUCCESS'
function receiveAsData(data, country, risk, AsId, graphId) {
  return {
    type: FETCH_AS_DATA_SUCCESS,
    data,
    country,
    risk,
    AsId,
    graphId
  }
}

export const FETCH_AS_DATA_FAILURE = 'FETCH_AS_DATA_FAILURE'
function receiveAsDataFailure(message, country, risk, AsId, graphId) {
  return {
    type: FETCH_AS_DATA_FAILURE,
    error: message,
    country,
    risk,
    AsId,
    graphId
  }
}

export const SELECT_AS = 'SELECT_AS'
export function AsIsSelected(idxOfSelector, selectedAS, graphId) {
  return {
    type: SELECT_AS,
    idxOfSelector,
    selectedAS,
    graphId
  }
}

export function fetchAsData(country, risk, AsId, graphId, test=false) {
  return function(dispatch) {
    dispatch(requestAsData(country, risk, AsId, graphId))
    let ENDPOINT = `/api/v1/count?limit=500&country=${country}&risk=${risk}&asn=${AsId}`
    if(!test) {
      ENDPOINT = CG_API_ENDPOINT + ENDPOINT
    }
    return axios.get(ENDPOINT)
      .then(res => dispatch(receiveAsData(res.data.results, country, risk, AsId, graphId)))
      .catch(err => dispatch(receiveAsDataFailure(err.message, country, risk, AsId, graphId)))
  }
}
