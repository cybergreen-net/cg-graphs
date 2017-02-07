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
      .get('/api/count_by_country?limit=500&country=t&risk=1')
      .replyWithFile(200, './public/fixtures/country/global/dns.json')
  });

  afterEach(() => {
   nock.cleanAll();
  });

  it('Creates FETCH_DATA_REQUEST action when fetching the API begins', () => {
    const store = mockStore({})
    store.dispatch(actions.fetchData('t', 1))
    let actionCreators = store.getActions()
    expect(actionCreators[0].type).toEqual('FETCH_DATA_REQUEST')
  })

  it('Creates FETCH_DATA_SUCCESS actions when fetching the API succeed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchData('t', 1))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_DATA_SUCCESS')
    expect(actionCreators[1].data[0].risk).toEqual(1)
    expect(actionCreators[1].data[0].country).toEqual('T')
  })

  it('Creates FETCH_DATA_FAILURE actions when fetching the API failed', async () => {
    const store = mockStore({})
    await store.dispatch(actions.fetchData('error'))
    let actionCreators = store.getActions()
    expect(actionCreators[1].type).toEqual('FETCH_DATA_FAILURE')
    expect(actionCreators[1].error).toContain('No match for request get')
  })

})
