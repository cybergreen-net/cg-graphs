import { combineReducers } from 'redux';
import { risks } from '../src/reducers/DDOSreducers';

describe('reducer risks', () => {
  const initialState = {
    isFetching: false,
    isFetched: false,
    didFailed: false,
    errorMessage: null,
    data: {}
  };
  const stateAfterRequest = {
    isFetching: true,
    isFetched: false,
    didFailed: false,
    errorMessage: null,
    data: {}
  };

  it('sets isFetching=true when risk fetching is requested', () => {
    let newStore = risks(initialState, {type: 'FETCH_RISK_REQUEST'});
    expect(newStore.isFetching).toEqual(true);
  })

  it('sets isFetched=true and updates store with data when fetching succeeds', () => {
    let newStore = risks(stateAfterRequest, {
      type: 'FETCH_RISK_SUCCESS',
      data: {date:'2016-12-01'}
    })
    expect(newStore.isFetching).toEqual(false);
    expect(newStore.isFetched).toEqual(true);
    expect(newStore.data).toEqual({date:'2016-12-01',});
  })

  it('sets didFailed=true when fetching failed', () => {
    let newStore = risks(stateAfterRequest, {
      type: 'FETCH_RISK_FAILURE',
      error: 'this is test error'
    })
    expect(newStore.isFetching).toEqual(false);
    expect(newStore.isFetched).toEqual(false);
    expect(newStore.didFailed).toEqual(true);
    expect(newStore.errorMessage).toEqual('this is test error');
  })

})
