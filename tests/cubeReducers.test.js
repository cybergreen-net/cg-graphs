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
      errorMessage: 'test error',
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
})
