/**
 * Created by guoshuyu on 2017/11/7.
 */
import {applyMiddleware, createStore} from 'redux';
import {thunk} from 'redux-thunk';
import reducers from './reducers';
import {createReducer} from './reducerUtils';

export {createReducer};

const store = createStore(reducers, applyMiddleware(thunk));
export default store