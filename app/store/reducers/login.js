/**
 * Created by guoshuyu on 2017/11/7.
 */
import  {LOGIN} from '../type';
import {createReducer} from '../'

const initialState = {
    type: LOGIN.CLEAR,
};

const actionHandler = {
    [LOGIN.IN]: (state, action) => {
        return {}
    },
    [LOGIN.CLEAR]: (state, action) => {
        return {}
    }
};

export default createReducer(initialState, actionHandler)