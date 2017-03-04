/* global CG_API_ENDPOINT*/
import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions/ChoroplethMapActions'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const host = 'http://localhost';
axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('Choropleth Map async actions', () => {

  beforeEach(() =>{
    nock(host)
      .persist()
      .get('/api/v1/count_by_country?limit=500&risk=1&start=2017-01-01&granularity=month')
      .replyWithFile(200, './public/fixtures/choroplethmap/sample.json')
  });

  afterEach(() => {
   nock.cleanAll();
  });

  it('Creates FETCH_MAP_DATA_REQUEST action when fetching the API begins', () => {
    const store = mockStore({})
    store.dispatch(actions.fetchData(1, '2017-01-01', true))
    let actionCreators = store.getActions()
    expect(actionCreators[0].type).toEqual('FETCH_MAP_DATA_REQUEST')
  })

  it('Creates FETCH_MAP_DATA_SUCCESS actions when fetching the API succeed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchData(1, '2017-01-01', true))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_MAP_DATA_SUCCESS')
    expect(actionCreators[1].data[0].risk).toEqual(1)
    expect(actionCreators[1].data[0].date).toEqual('2017-01-01')
  })

  it('Creates FETCH_MAP_DATA_FAILURE actions when fetching the API failed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchData('error', 'error', true))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_MAP_DATA_FAILURE')
    expect(actionCreators[1].error).toContain('No match for request')
  })

})


describe('how cached data for choropleth map works', () => {
  it('checks if data for given risk and date is cached', () => {
    const testState = {
      entities: {
        cubeByRiskByDate: {
          100: {
            '2017-01-01': 'data'
          }
        }
      }
    }
    const dataIsCached = actions.shouldFetchData(testState, 100, '2017-01-01')
    const dataIsNotCached = actions.shouldFetchData(testState, 1, '2017-01-01')
    //if data cached it returns false so we don't make a server request
    expect(dataIsCached).toBeFalsy()
    expect(dataIsNotCached).toBeTruthy()
  })

  it('Checks if no fetching started if data is in cubeByRiskByDate and fetching started if oposite', () => {
    const store = mockStore({
      entities: {
        cubeByRiskByDate:{ 100: {'2017-01-01': []}}
      }
    })
    // if data is there no actions called
    store.dispatch(actions.fetchDataIfNeeded(100, '2017-01-01'))
    let actionCreators = store.getActions()
    expect(actionCreators.length).toEqual(0)
    // if data is not there FETCH_DATA_REQUEST is triggered
    store.dispatch(actions.fetchDataIfNeeded(1, '2017-01-01', true))
    actionCreators = store.getActions()
    expect(actionCreators.length).toEqual(1)
    expect(actionCreators[0].type).toEqual('FETCH_MAP_DATA_REQUEST')
  })

})
