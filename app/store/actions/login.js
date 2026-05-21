/**
 * Created by guoshuyu on 2017/11/7.
 */

import Api from '../../net'
import Address from '../../net/address'
import {LOGIN} from '../type'
import userAction from './user'
import * as Constant from '../../style/constant'
import {Buffer} from 'buffer'
import {clear} from '../reducers'
import {CLIENT_ID, CLIENT_SECRET} from '../../config/ignoreConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';

const toLogin = () => async (dispatch, getState) => {

};

/**
 * 登陆请求
 */
const doLogin = (code, callback) => async (dispatch, getState) => {
    Api.clearAuthorization();

    let url = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`
    let res = await Api.netFetch(url, 'GET', null, false, null, true);
    if (res && res.result) {
        let data = res.data;
        let key = "access_token=";
        let token = data.substring((data.indexOf(key) + key.length), data.indexOf("&"))
        let authorizationCode = 'token ' + token;
        await AsyncStorage.setItem(Constant.TOKEN_KEY, authorizationCode);
        let current = await userAction.getUserInfo();
        dispatch({
            type: LOGIN.IN,
            res
        });
    }
    setTimeout(() => {
        callback && callback(res.result);
    }, 1000)
};

/**
 * 使用 Personal Access Token 直接登录
 * 接受 'ghp_xxx' / 'github_pat_xxx' 等 token 字符串，
 * 拼成 `token xxx` 写入 AsyncStorage，再调 /user 校验。
 */
const doTokenLogin = (rawToken, callback) => async (dispatch, getState) => {
    Api.clearAuthorization();

    let token = (rawToken || '').trim();
    if (!token) {
        callback && callback(false);
        return;
    }
    let bare = token.toLowerCase().startsWith('token ')
        ? token.slice(6).trim()
        : token;
    let authorizationCode = 'token ' + bare;
    await AsyncStorage.setItem(Constant.TOKEN_KEY, authorizationCode);

    let current = await userAction.getUserInfo();
    if (current && current.result) {
        dispatch({
            type: LOGIN.IN,
            res: {result: true, data: current.data}
        });
        callback && callback(true);
    } else {
        Api.clearAuthorization();
        await AsyncStorage.removeItem(Constant.TOKEN_KEY);
        await AsyncStorage.removeItem(Constant.USER_INFO);
        await AsyncStorage.removeItem(Constant.USER_BASIC_CODE);
        userAction.clearUserInfo();
        callback && callback(false);
    }
};

/**
 * 退出登录
 */
const loginOut = () => async (dispatch, getState) => {
    Api.clearAuthorization();
    AsyncStorage.removeItem(Constant.USER_BASIC_CODE);
    userAction.clearUserInfo();
    clear(getState);
    dispatch({
        type: LOGIN.CLEAR,
    });
};

/**
 * 获取当前登录用户的参数
 */
const getLoginParams = async () => {
    let userName = await AsyncStorage.getItem(Constant.USER_NAME_KEY);
    let password = await AsyncStorage.getItem(Constant.PW_KEY);
    return {
        userName: (userName) ? userName : "",
        password: (password) ? password : "",
    }
};

export default {
    toLogin,
    doLogin,
    doTokenLogin,
    getLoginParams,
    loginOut

}
