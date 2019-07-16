/**
 * Created by guoshuyu on 2017/11/16.
 */
import {USER} from '../type';
import {createReducer} from '../'

const initialState = {
    //当前登录用户信息
    userInfo: {},
};

const actionHandler = {
    [USER.USER_INFO]: (state, action) => {
        return {
            ...state,
            userInfo: action.res
        }
    },
};

export default createReducer(initialState, actionHandler)
