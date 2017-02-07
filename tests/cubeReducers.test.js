import { buildCube } from '../src/reducers/cubeReducers';

describe('buildCube reducer', () => {
  const initialState = {
    entities: {
      countries: {},
      risks: {},
      cubeByRiskByCountry: {}
    },
    views: { 1: {} }
  }

  it('While requesting sets isFetching=true, shold not modify cube', () => {
    let newStore = buildCube(initialState, {
      type: 'FETCH_DATA_REQUEST',
      country: 'gb',
      risk: 1
    });
    expect(newStore.views[1].isFetching).toBeTruthy()
    expect(newStore.views[1].isFetched).toBeFalsy()
    expect(newStore.views[1].didFailed).toBeFalsy()
    expect(newStore.entities).toEqual(initialState.entities)
  })

  it('On success it puts data in cubeByRiskByCountry and sets isFetched=true', () => {
    let data = [{
      "risk": 1,"country": "GB","date": "2017-01-16",
      "count": "11506","count_amplified": 4571746
    }]
    let newStore = buildCube(initialState, {
      type: 'FETCH_DATA_SUCCESS',
      data: data,
      country: 'gb',
      risk: 1
    });
    expect(newStore.views[1].isFetching).toBeFalsy()
    expect(newStore.views[1].isFetched).toBeTruthy()
    expect(newStore.views[1].didFailed).toBeFalsy()
    expect(newStore.entities.cubeByRiskByCountry[1]['gb']).toEqual(data)
  })

  it('On failure - no data is fetched and error message is returned', () => {
    let newStore = buildCube(initialState, {
      type: 'FETCH_DATA_FAILURE',
      error: 'test error',
      country: 'gb',
      risk: 1
    });
    let expected = {
      type: 'country/performance',
      risk: 1,country: 'gb',
      isFetched: false,isFetching: false,didFailed: true,
      errorMessage: 'test error'
    }
    expect(newStore.views[1]).toEqual(expected)
    expect(newStore.entities).toEqual(initialState.entities)
  })

  it('On selector change it updates selectorConfig in views of store', () => {
    let newState = Object.assign({}, initialState, {
      views: {
        1: {
          selectorConfig: [
            {disabled: true, country: "gb"},
            {disabled: true, country: "t"},
            {disabled: false, country: undefined}
          ]
        }
      }
    })
    let newStore = buildCube(newState, {
      type: 'SELECT',
      idxOfSelector: 2,
      selectedCountry: 'gb'
    });
    expect(newStore.views[1].selectorConfig[2].country).toEqual('gb')
  })
})
