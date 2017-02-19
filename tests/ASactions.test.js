/* global CG_API_ENDPOINT*/
import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions/ASactions'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const host = 'http://localhost';
axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('AS async actions', () => {

  beforeEach(() =>{
    nock(host)
      .persist()
      .get('/api/v1/count?limit=500&country=GB&risk=1&asn=174')
      .replyWithFile(200, './public/fixtures/asn/174/174.json')
  });

  afterEach(() => {
   nock.cleanAll();
  });

  it('Creates FETCH_AS_DATA_REQUEST action when fetching the API begins', () => {
    const store = mockStore({})
    store.dispatch(actions.fetchAsData('GB', 1, 174, 'GB/1/174', true))
    let actionCreators = store.getActions()
    expect(actionCreators[0].type).toEqual('FETCH_AS_DATA_REQUEST')
  })

  it('Creates FETCH_AS_DATA_SUCCESS actions when fetching the API succeed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchAsData('GB', 1, 174, 'GB/1/174', true))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_AS_DATA_SUCCESS')
    expect(actionCreators[1].data[0].risk).toEqual(1)
    expect(actionCreators[1].data[0].country).toEqual('GB')
    expect(actionCreators[1].data[0].asn).toEqual('174')
  })

  it('Creates FETCH_AS_DATA_FAILURE actions when fetching the API failed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchAsData('error', 'error', 'error', 'error', true))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_AS_DATA_FAILURE')
    expect(actionCreators[1].error).toContain('No match for request')
  })

})

describe('how cached data is used for AS data', () => {
  it('checks if given country, risk and AsId data is cached', () => {
    const testState = {
      entities: {
        cubeByRiskByASN: {
          'GB/1/174': {}
        }
      }
    }
    const dataIsCached = actions.shouldFetchAsData(testState, 'GB', 1, 174)
    const dataIsNotCached = actions.shouldFetchAsData(testState, 'GB', 1, 123)
    //if data cached it returns false so we don't make a server request
    expect(dataIsCached).toBeFalsy()
    expect(dataIsNotCached).toBeTruthy()
  })

  it('Checks if no fetching started if AS data is in cubeByRiskByASN and fetching started if oposite', () => {
    const store = mockStore({
      entities: {
        cubeByRiskByASN:{
          'GB/1/174': {}
        }
      }
    })
    // if data is there no actions called
    store.dispatch(actions.fetchAsDataIfNeeded('GB', 1, 174, 'GB/1/174'))
    let actionCreators = store.getActions()
    expect(actionCreators.length).toEqual(0)
    // if fata is not there FETCH_DATA_REQUEST is triggered
    store.dispatch(actions.fetchAsDataIfNeeded('test', 1, 123, 'test/1/123', true))
    actionCreators = store.getActions()
    expect(actionCreators.length).toEqual(1)
    expect(actionCreators[0].type).toEqual('FETCH_AS_DATA_REQUEST')
  })
})
