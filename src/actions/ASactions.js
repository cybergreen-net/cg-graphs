import axios from 'axios'

export const FETCH_AS_DATA_REQUEST = 'FETCH_AS_DATA_REQUEST'
function requestAsData(country, risk, AsId) {
  return {
    type: FETCH_AS_DATA_REQUEST,
    country,
    risk,
    AsId
  }
}

export const FETCH_AS_DATA_SUCCESS = 'FETCH_AS_DATA_SUCCESS'
function receiveAsData(data, country, risk, AsId) {
  return {
    type: FETCH_AS_DATA_SUCCESS,
    data,
    country,
    risk,
    AsId
  }
}

export const FETCH_AS_DATA_FAILURE = 'FETCH_AS_DATA_FAILURE'
function receiveAsDataFailure(message, country, risk, AsId) {
  return {
    type: FETCH_AS_DATA_FAILURE,
    error: message,
    country,
    risk,
    AsId
  }
}

export function fetchAsData(country, risk, AsId, test=false) {
  return function(dispatch) {
    dispatch(requestAsData(country, risk, AsId))
    // I am not sure how full URL should look like here:
    let url = `https://cybergreen-staging.herokuapp.com/api/v1/count?limit=500&country=${country}&risk=${risk}&as=${AsId}`
    if (test){
      url = `/api/v1/count?limit=500&country=${country}&risk=${risk}&as=${AsId}`
    }
    return axios.get(url)
      .then(res => dispatch(receiveAsData(res.data.results, country, risk, AsId)))
      .catch(err => dispatch(receiveAsDataFailure(err.message, country, risk, AsId)))
  }
}
