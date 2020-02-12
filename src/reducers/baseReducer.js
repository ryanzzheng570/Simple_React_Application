import { combineReducers } from 'redux';
import sampleReducer from './sampleReducer';

//Using combine Reducers to combine multiple reducers
export default combineReducers({
  sampleReducer
});
