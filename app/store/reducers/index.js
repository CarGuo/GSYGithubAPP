/**
 * Created by guoshuyu on 2017/11/7.
 */

import {combineReducers} from 'redux';
import login from "./login"
import user from "./user"


export default combineReducers({
    login: login,
    user: user
});
