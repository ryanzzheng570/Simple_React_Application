import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import baseReducer from './reducers/baseReducer';

//There can be an initial state
export default function configureStore(initialState={}) {
  return createStore(
    baseReducer,
    initialState,
    applyMiddleware(thunk)
  )
}
