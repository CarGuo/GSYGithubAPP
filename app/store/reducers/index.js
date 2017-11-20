/**
 * Created by guoshuyu on 2017/11/7.
 */

import {combineReducers} from 'redux';
import login from "./login"
import user from "./user"
import event from "./event"
import repository from "./repository"


export default combineReducers({
    login: login,
    user: user,
    event: event,
    repository: repository,
});
