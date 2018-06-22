import {AsyncStorage} from 'react-native'
import Api from '../net'
import Address from '../net/address'
import * as Constant from '../style/constant'
import realm from './db'


/**
 * 获取本地登录用户信息
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

/**
 * 获取用户详细信息
 */
const getUserInfoDao = async (userName) => {
    let nextStep = async () => {
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
            realm.write(() => {
                let allData = realm.objects('UserInfo').filtered(`userName="${res.data.login}"`);
                if (allData && allData.length > 0) {
                    allData[0].data = JSON.stringify(totalInfo);
                } else {
                    realm.create('UserInfo', {
                        userName: res.data.login,
                        data: JSON.stringify(totalInfo)
                    });
                }
            });

            if (!userName) {
                AsyncStorage.setItem(Constant.USER_INFO, JSON.stringify(totalInfo));
            }
            return {
                result: true,
                data: totalInfo,
            }
        } else {
            return {
                result: false,
                data: res.data
            }
        }
    };

    let allData = realm.objects('UserInfo').filtered(`userName="${userName}"`);
    if (allData && allData.length > 0) {
        return {
            data: JSON.parse(allData[0].data),
            next: nextStep,
            result: true,
        };
    } else {
        return {
            data: [],
            next: nextStep,
            result: false
        };
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


/**
 * 获取用户粉丝列表
 */
const getFollowerListDao = async (userName, page, localNeed) => {
    let nextStep = async () => {
        let url = Address.getUserFollower(userName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('UserFollower').filtered(`userName="${userName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('UserFollower', {
                        userName: userName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('UserFollower').filtered(`userName="${userName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};

/**
 * 获取用户关注列表
 */
const getFollowedListDao = async (userName, page, localNeed) => {
    let nextStep = async () => {
        let url = Address.getUserFollow(userName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('UserFollowed').filtered(`userName="${userName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('UserFollowed', {
                        userName: userName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('UserFollowed').filtered(`userName="${userName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};

/**
 * 获取用户相关通知
 */
const getNotifationDao = async (all, participating, page) => {
    let tag = (!all && !participating) ? '?' : "&";
    let url = Address.getNotifation(all, participating) + Address.getPageParams(tag, page);
    let res = await Api.netFetch(url)
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 设置单个通知已读
 */
const setNotificationAsReadDao = async (id) => {
    let url = Address.setNotificationAsRead(id)
    let res = await Api.netFetch(url, "PATCH");
    return {
        result: res.result,
        data: res.data
    }

};


/**
 * 设置所有通知已读
 */
const setAllNotificationAsReadDao = async () => {
    let url = Address.setAllNotificationAsRead()
    let res = await Api.netFetch(url, "PUT", {}, true);
    return {
        result: res.result,
        data: res.data
    }

};

/**
 * 更新用户信息
 */
const updateUserDao = async (params) => {
    let url = Address.getMyUserInfo()
    let res = await Api.netFetch(url, "PATCH", params, true);
    if (res && res.result) {
        AsyncStorage.setItem(Constant.USER_INFO, JSON.stringify(res.data));
    }
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 关注用户
 */
const doFollowDao = async (name, followed) => {
    let url = Address.doFollow(name);
    let res = await Api.netFetch(url, followed ? "PUT" : "DELETE");
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 检查用户关注状态
 */
const checkFollowDao = async (name) => {
    let url = Address.doFollow(name);
    let res = await Api.netFetch(url);
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 组织成员
 */
const getMemberDao = async (userName, page, localNeed) => {
    let nextStep = async () => {
        let url = Address.getMember(userName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('OrgMember').filtered(`org="${userName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('OrgMember', {
                        org: userName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('OrgMember').filtered(`org="${userName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};


/**
 * 获取用户组织
 */
const getUserOrgsDao = async (userName, page, localNeed) => {
    let nextStep = async () => {
        let url = Address.getUserOrgs(userName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('UserOrgs').filtered(`userName="${userName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('UserOrgs', {
                        userName: userName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('UserOrgs').filtered(`userName="${userName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};


export default {
    getUserInfoLocal,
    getUserInfoDao,
    getFollowerListDao,
    getFollowedListDao,
    getNotifationDao,
    setNotificationAsReadDao,
    setAllNotificationAsReadDao,
    updateUserDao,
    doFollowDao,
    checkFollowDao,
    getMemberDao,
    getUserOrgsDao
}
