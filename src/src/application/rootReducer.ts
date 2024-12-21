import { combineReducers } from 'redux';
import helloWorldReducer from './reducers/helloWorldReducer';

export default combineReducers({
  helloWorld: helloWorldReducer,
});
