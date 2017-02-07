import {
  FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE
} from '../actions/cubeActions';

export function buildCube(state, action) {
  switch (action.type) {
    case FETCH_DATA_FAILURE:
      return Object.assign({}, state, {
        views: Object.assign({}, state.views, { 1: {
                type: 'country/performance',
                risk: action.risk, country: action.country,
                isFetched: false, isFetching: false, didFailed: true,
                errorMessage: action.errorMessage
                }
              }
            )
          }
        )
    case FETCH_DATA_REQUEST:
      return Object.assign({}, state, {
        views: Object.assign({}, state.views, { 1: {
                type: 'country/performance',
                risk: action.risk, country: action.country,
                isFetched: false, isFetching: true, didFailed: false,
                }
              }
            )
          }
        )
    case FETCH_DATA_SUCCESS:
      return Object.assign({}, state, {
          views: Object.assign({}, state.views, { 1: {
                type: 'country/performance',
                risk: action.risk, country: action.country,
                isFetched: true, isFetching: false, didFailed: false,
              }
            }
          )
        },
        {
          entities: Object.assign(
              {}, state.entities, {
                cubeByRiskByCountry: Object.assign(
                  {}, state.entities.cubeByRiskByCountry,{[action.risk]: Object.assign(
                    {}, state.entities.cubeByRiskByCountry[action.risk], {
                      [action.country]: action.data}
                  )
                }
              )
            }
          )
        }
      )
    default:
      return state
  }
}
