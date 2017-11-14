/**
 * Created by guoshuyu on 2017/11/7.
 */

import {AsyncStorage} from 'react-native'
import Api from '../../funtion/net'
import Address from '../../funtion/net/address'
import {LOGIN} from '../type'
import * as Constant from '../../style/constant'
import Buffer from 'buffer'

const toLogin = () => async(dispatch, getState) => {

};

/**
 * 登陆请求
 */
const doLogin = (userName, password) => async(dispatch, getState) => {
    let base64Str = new Buffer(userName + ":" + password).toString('base64');
    AsyncStorage.setItem(Constant.USER_BASIC_CODE, base64Str);
    let res = await Api.netFetch(Address.getAuthorization(), 'POST');
    if (res && res.result) {
        AsyncStorage.setItem(Constant.USER_NAME_KEY, password);
        dispatch({
            type: LOGIN.IN,
            res
        });
        console.log("******************* " + res);
    }
};


export default {
    toLogin,
    doLogin
}