import {AsyncStorage} from 'react-native'
import Api from '../net'
import Address from '../net/address'
import {USER} from '../store/type'
import * as Constant from '../style/constant'

/**
 *
 */
const getUserInfoLocal = async () => {
    let userText = await AsyncStorage.getItem(Constant.USER_INFO);
    if (userText) {
        let res = JSON.parse(userText);
        return {
            result: true,
            data: res
        }
    } else {
        return {
            result: false
        }
    }
};

const getUserInfoNet = async (userName) => {
    let res;
    if (!userName) {
        res = await Api.netFetch(Address.getMyUserInfo());
    } else {
        res = await Api.netFetch(Address.getUserInfo(userName));
    }
    if (res && res.result) {
        let countRes = await getUserStaredCountNet(res.data.login);
        let starred = "---";
        if (countRes.result) {
            starred = countRes.data;
        }
        let totalInfo = Object.assign({}, res.data, {starred: starred});
        if (!userName) {
            AsyncStorage.setItem(Constant.USER_INFO, JSON.stringify(totalInfo));
        }
        return {
            result: true,
            data: totalInfo
        }
    } else {
        return {
            result: false,
            data: res.data
        }
    }
};

/**
 * 在header中提起stared count
 */
const getUserStaredCountNet = async (userName) => {
    let res = await Api.netFetch(Address.userStar(userName) + "&per_page=1");
    if (res && res.result && res.headers && res.headers.map) {
        try {
            let link = res.headers.map['link'];
            if (link && (typeof link) === 'object') {
                let indexStart = link[0].lastIndexOf("page=") + 5;
                let indexEnd = link[0].lastIndexOf(">");
                if (indexStart >= 0 && indexEnd >= 0) {
                    let count = link[0].substring(indexStart, indexEnd);
                    return {
                        result: true,
                        data: count
                    }
                }
            }
            return {
                result: true,
            }
        } catch (e) {
            console.log(e)
        }
        return {
            result: false,
        }
    } else {
        return {
            result: false,
        }
    }
};


const getFollowerListDao = async (userName, page) => {
    let res = await Api.netFetch(Address.getUserFollower(userName) + Address.getPageParams("?", page));
    return {
        result: res.result,
        data: res.data
    }
};

const getFollowedListDao = async (userName, page) => {
    let res = await Api.netFetch(Address.getUserFollow(userName) + Address.getPageParams("?", page));
    return {
        result: res.result,
        data: res.data
    }
};

const getNotifationDao = async (all, participating, page) => {
    let tag = (!all && !participating) ? '?' : "&";
    let url = Address.getNotifation(all, participating) + Address.getPageParams(tag, page);
    let res = await Api.netFetch(url)
    return {
        result: res.result,
        data: res.data
    }
};

const setNotificationAsReadDao = async (id) => {
    let url = Address.setNotificationAsRead(id)
    let res = await Api.netFetch(url, "PATCH");
    return {
        result: res.result,
        data: res.data
    }

};


export default {
    getUserInfoLocal,
    getUserInfoNet,
    getUserStaredCountNet,
    getFollowerListDao,
    getFollowedListDao,
    getNotifationDao,
    setNotificationAsReadDao
}
