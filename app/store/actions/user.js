/**
 * Created by guoshuyu on 2017/11/9.
 */

import {USER} from '../type'
import UserDao from '../../dao/userDao'
import * as Constant from '../../style/constant'
import store from '../'
import {AsyncStorage} from 'react-native'

const {dispatch, getState} = store;

/**
 * 初始化用户信息
 */
const initUserInfo = async () => {
    let token = await AsyncStorage.getItem(Constant.TOKEN_KEY);
    let res = await UserDao.getUserInfoLocal();
    if (res && res.result && token) {
        dispatch({
            type: USER.USER_INFO,
            res: res.data
        });
    }
    return {
        result: res.result && (token !== null),
        data: res.data
    };

};

const getUserInfo = () => {
    UserDao.getUserInfoNet().then((res) => {
        if (res && res.result) {
            dispatch({
                type: USER.USER_INFO,
                res: res.data
            });
        }
    });
};

const getOtherUserInfo = async (userName) => {
    return UserDao.getUserInfoNet(userName);
};

const clearUserInfo = () => {
    AsyncStorage.removeItem(Constant.USER_INFO);
    dispatch({
        type: USER.USER_INFO,
        res: null
    });
};

const getFollowerList = async (userName, page = 1) => {
    let res = await UserDao.getFollowerListDao(userName, page);
    return {
        result: res.result,
        data: res.data
    }
};

const getFollowedList = async (userName, page = 1) => {
    let res = await UserDao.getFollowedListDao(userName, page);
    return {
        result: res.result,
        data: res.data
    }
};

const getNotifation = async (all, participating, page) => {
    let res = await UserDao.getNotifationDao(all, participating, page)
    return {
        result: res.result,
        data: res.data
    }
};

const setNotificationAsRead = async (id) => {
    let res = await UserDao.setNotificationAsReadDao(id);
    return {
        result: res.result,
        data: res.data
    }
};


export default {
    initUserInfo,
    getUserInfo,
    getOtherUserInfo,
    clearUserInfo,
    getFollowerList,
    getFollowedList,
    getNotifation,
    setNotificationAsRead
}
