/**
 * Created by guoshuyu on 2017/11/9.
 */

import {USER} from '../type'
import UserDao from '../../dao/userDao'
import * as Constant from '../../style/constant'
import store from '../'
import {AsyncStorage} from 'react-native'
import RepositoryDao from "../../dao/repositoryDao";
import Api from "../../net";
import Address from "../../net/address";

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

/**
 * 获取登录用户信息
 */
const getUserInfo = async () => {
    let res = await UserDao.getUserInfoDao();
    let resData = await res.next();
    if (resData && resData.result) {
        dispatch({
            type: USER.USER_INFO,
            res: resData.data
        });
    }
    return resData;
};

/**
 * 获取其他用户信息
 */
const getPersonUserInfo = async (userName) => {
    return UserDao.getUserInfoDao(userName);
};

/**
 * 清除登录用户信息
 */
const clearUserInfo = () => {
    AsyncStorage.removeItem(Constant.USER_INFO);
    dispatch({
        type: USER.USER_INFO,
        res: null
    });
};

/**
 * 获取用户粉丝列表
 */
const getFollowerList = async (userName, page = 1) => {
    if (page <= 1) {
        return UserDao.getFollowerListDao(userName, page, true);
    } else {
        return UserDao.getFollowerListDao(userName, page)
    }
};

/**
 * 获取用户关注列表
 */
const getFollowedList = async (userName, page = 1) => {
    if (page <= 1) {
        return UserDao.getFollowedListDao(userName, page, true);
    } else {
        return UserDao.getFollowedListDao(userName, page)
    }
};

/**
 * 获取用户相关通知
 */
const getNotifation = async (all, participating, page) => {
    let res = await UserDao.getNotifationDao(all, participating, page)
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 设置单个通知已读
 */
const setNotificationAsRead = async (id) => {
    let res = await UserDao.setNotificationAsReadDao(id);
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 设置所有通知已读
 */
const setAllNotificationAsRead = async () => {
    let res = await UserDao.setAllNotificationAsReadDao();
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 更新用户信息
 */
const updateUser = async (params) => {
    let res = await UserDao.updateUserDao(params);
    if (res && res.result) {
        dispatch({
            type: USER.USER_INFO,
            res: res.data
        });
    }
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 关注用户
 */
const doFollow = async (name, followed) => {
    let res = await UserDao.doFollowDao(name, followed);
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 检查用户关注状态
 */
const checkFollow = async (name, followed) => {
    let res = await UserDao.checkFollowDao(name);
    return {
        result: res.result,
        data: res.data
    }
};


/**
 * 获取组织成员
 */
const getMember = async (page = 1, userName) => {
    if (page <= 1) {
        return UserDao.getMemberDao(userName, page, true);
    } else {
        return UserDao.getMemberDao(userName, page)
    }
};

/**
 * 获取用户组织
 */
const getUserOrgs = async (page = 1, userName) => {
    if (page <= 1) {
        return UserDao.getUserOrgsDao(userName, page, true);
    } else {
        return UserDao.getUserOrgsDao(userName, page)
    }
};

export default {
    initUserInfo,
    getUserInfo,
    getPersonUserInfo,
    clearUserInfo,
    getFollowerList,
    getFollowedList,
    getNotifation,
    setNotificationAsRead,
    setAllNotificationAsRead,
    updateUser,
    doFollow,
    checkFollow,
    getMember,
    getUserOrgs
}
