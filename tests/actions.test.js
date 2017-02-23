/* global CG_API_ENDPOINT*/
import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions/cubeActions'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const host = 'http://localhost';
axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('async actions', () => {

  beforeEach(() =>{
    nock(host)
      .persist()
      .get('/api/v1/count_by_country?limit=500&country=t&risk=1&drilldown=as&drilldown_limit=5')
      .replyWithFile(200, './public/fixtures/country/global/dns.json')
  });

  afterEach(() => {
   nock.cleanAll();
  });

  it('Creates FETCH_DATA_REQUEST action when fetching the API begins', () => {
    const store = mockStore({})
    store.dispatch(actions.fetchData('t', 1, 'gb/1', null, true))
    let actionCreators = store.getActions()
    expect(actionCreators[0].type).toEqual('FETCH_DATA_REQUEST')
  })

  it('Creates FETCH_DATA_SUCCESS actions when fetching the API succeed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchData('t', 1, 'gb/1', null, true))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_DATA_SUCCESS')
    expect(actionCreators[1].data[0].risk).toEqual(1)
    expect(actionCreators[1].data[0].country).toEqual('T')
  })

  it('Creates FETCH_DATA_FAILURE actions when fetching the API failed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchData('error', 'error', 'error', null, true))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_DATA_FAILURE')
    expect(actionCreators[1].error).toContain('No match for request')
  })

})

describe('how cached data is used', () => {
  it('checks if given country and risk data is cached', () => {
    const testState = {
      entities: {
        cubeByRiskByCountry: {
          1: {
            'gb': 'data'
          }
        }
      }
    }
    const dataIsCached = actions.shouldFetchData(testState, 'gb', 1)
    const dataIsNotCached = actions.shouldFetchData(testState, 'us', 1)
    //if data cached it returns false so we don't make a server request
    expect(dataIsCached).toBeFalsy()
    expect(dataIsNotCached).toBeTruthy()
  })

  it('Checks if no fetching started if data is in cubeByRiskByCountry and fetching started if oposite', () => {
    const store = mockStore({
      entities: {
        cubeByRiskByCountry:{ 1: {'test': []}}
      }
    })
    // if data is there no actions called
    store.dispatch(actions.fetchDataIfNeeded('test', 1, 'test/1'))
    let actionCreators = store.getActions()
    expect(actionCreators.length).toEqual(0)
    // if data is not there FETCH_DATA_REQUEST is triggered
    store.dispatch(actions.fetchDataIfNeeded('newTest', 1, 'newTest/1', null, true))
    actionCreators = store.getActions()
    expect(actionCreators.length).toEqual(1)
    expect(actionCreators[0].type).toEqual('FETCH_DATA_REQUEST')
  })
})
