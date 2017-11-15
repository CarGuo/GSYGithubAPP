/**
 * Created by guoshuyu on 2017/11/7.
 */

import {AsyncStorage} from 'react-native'
import Api from '../../funtion/net'
import Address from '../../funtion/net/address'
import {LOGIN} from '../type'
import * as Constant from '../../style/constant'
import {Buffer} from 'buffer'
import {CLIENT_ID, CLIENT_SECRET} from '../../config/ignoreConfig'

const toLogin = () => async(dispatch, getState) => {

};

/**
 * 登陆请求
 */
const doLogin = (userName, password) => async(dispatch, getState) => {
    let base64Str = Buffer(userName + ":" + password).toString('base64');
    AsyncStorage.setItem(Constant.USER_BASIC_CODE, base64Str);
    let requestParams = {
        scopes: ['public_repo'],
        note: "admin_script",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    };

    let res = await Api.netFetch(Address.getAuthorization(), 'POST', requestParams, true);
    if (res && res.result) {
        AsyncStorage.setItem(Constant.PW_KEY, password);
        dispatch({
            type: LOGIN.IN,
            res
        });
    }
};


export default {
    toLogin,
    doLogin
}