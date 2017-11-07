/**
 * Created by guoshuyu on 2017/11/7.
 */
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

let createAppStore = applyMiddleware(thunk)(createStore);


export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else {
            return state;
        }
    }
}

export default function configureStore() {
    return (createAppStore)(reducers);
}
