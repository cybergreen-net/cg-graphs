import { buildCube } from '../src/reducers/cubeReducers';

describe('buildCube reducer', () => {
  const preInitialState = {
    entities: {
      countries: {},
      risks: {},
      cubeByRiskByCountry: {}
    },
    views: {}
  }
  // We are setting initial views here to check later on
  const initialState = buildCube(preInitialState, {
    type: 'SET_VIEWS',
    viewOptions: {country: 'gb', risk: [1], type: 'testing'},
    risk: 1
  });

  const stateClone = Object.assign({}, initialState)

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
    expect(newStore.views[1].isFetching).toBeFalsy()
    expect(newStore.views[1].isFetched).toBeFalsy()
    expect(newStore.views[1].didFailed).toBeTruthy()
    expect(newStore.views[1].errorMessage).toEqual('test error')
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

  it('Checks store is not mutated', () => {
    expect(initialState).toEqual(stateClone)
  })
})

describe('Set Views', () => {
  const initialState = {
    entities: {
      countries: {},
      risks: {},
      cubeByRiskByCountry: {}
    },
    views: {}
  }
  const stateClone = Object.assign({}, initialState)
  let newStore = buildCube(initialState, {
    type: 'SET_VIEWS',
    viewOptions: {country: 'gb', risk: [1, 2, 'test'], type: 'testing'},
    risk: 1
  });

  it('Checks store is not mutated', () => {
    expect(initialState).toEqual(stateClone)
  })

  it('Checks if IDs of views set correctly', () => {
    expect(Object.keys(newStore.views)).toEqual(['1','2','test'])
  })

  it('Checks country adn risk are set correctly for each view', () => {
    expect(newStore.views.test.country).toEqual('gb')
    expect(newStore.views[1].country).toEqual('gb')
    expect(newStore.views.test.risk).toEqual('test')
    expect(newStore.views[1].risk).toEqual(1)
  })

  it('Checks if fetched infos are false by default', () => {
    expect(newStore.views.test.isFetching).toBeFalsy()
    expect(newStore.views.test.isFetched).toBeFalsy()
    expect(newStore.views.test.didFailed).toBeFalsy()
  })

  it('Checks if type of view is set properly', () => {
    expect(newStore.views.test.type).toEqual('testing')
  })

})
