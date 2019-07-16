/**
 * Created by guoshuyu on 2017/11/17.
 */


import Api from '../net'
import Address from '../net/address'
import realm from "./db";
import {changeServiceResult} from '../utils/htmlUtils'

/**
 * 获取仓库issue
 * @param page
 * @param userName
 * @param repository
 * @param state issue状态
 * @param sort 排序类型 created updated等
 * @param direction 正序或者倒序
 * @returns {Promise.<void>}
 */
const getRepositoryIssueDao = (page = 0, userName, repository, state, sort, direction, localNeed) => {
    let fullName = userName + "/" + repository;
    let stateName = state ? state : "all";
    let nextStep = async () => {
        let url = Address.getReposIssue(userName, repository, state, sort, direction) + Address.getPageParams("&", page);
        let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('RepositoryIssue').filtered(`fullName="${fullName}" AND state="${stateName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('RepositoryIssue', {
                        fullName: fullName,
                        state: stateName,
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
        let allData = realm.objects('RepositoryIssue').filtered(`fullName="${fullName}" AND state="${stateName}"`);
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
 * issue的回复列表
 */
const getIssueCommentDao = async (page = 0, userName, repository, number, localNeed) => {
    let fullName = userName + "/" + repository;
    let nextStep = async () => {
        let url = Address.getIssueComment(userName, repository, number) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('IssueComment').filtered(`fullName="${fullName}" AND number ="${number}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('IssueComment', {
                        number: number + "",
                        commentId: item.id + "",
                        fullName: fullName,
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
        let allData = realm.objects('IssueComment').filtered(`fullName="${fullName}" AND number ="${number}"`);
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
 * issue的详请
 */
const getIssueInfoDao = async (userName, repository, number) => {
    let fullName = userName + "/" + repository;
    let nextStep = async () => {
        let url = Address.getIssueInfo(userName, repository, number);
        let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
        if (res && res.result && res.data) {
            realm.write(() => {
                let data = realm.objects('IssueDetail').filtered(`fullName="${fullName}" AND number ="${number}"`);
                realm.delete(data);
                realm.create('IssueDetail', {
                    number: number + "",
                    fullName: fullName,
                    data: JSON.stringify(res.data)
                });
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let AllData = realm.objects('IssueDetail').filtered(`fullName="${fullName}" AND number ="${number}"`);
    if (AllData && AllData.length > 0) {
        return {
            data: JSON.parse(AllData[0].data),
            result: true,
            next: nextStep
        };
    } else {
        return {
            data: {},
            result: false,
            next: nextStep
        };
    }
};

/**
 * 增加issue的回复
 */
const addIssueCommentDao = async (userName, repository, number, comment) => {
    let fullName = userName + "/" + repository;
    let url = Address.addIssueComment(userName, repository, number);
    let res = await Api.netFetch(url, 'POST', {body: comment}, true, {Accept: 'application/vnd.github.VERSION.full+json'});
    if (res && res.result) {
        realm.write(() => {
            let id = res.data.id;
            realm.create('IssueComment', {
                number: number + "",
                commentId: id + "",
                fullName: fullName,
                data: JSON.stringify(res.data)
            });
        });
    }
    return {
        data: res.data,
        result: res.result
    };
};


/**
 * 编辑issue
 */
const editIssueDao = async (userName, repository, number, issue) => {
    let fullName = userName + "/" + repository;
    let url = Address.editIssue(userName, repository, number);
    let res = await Api.netFetch(url, 'PATCH', issue, true, {Accept: 'application/vnd.github.VERSION.full+json'});
    if (res && res.result) {
        realm.write(() => {
            let items = realm.objects('IssueDetail').filtered(`fullName="${fullName}" AND number ="${number}"`);
            if (items && items.length > 0) {
                items[0].data = JSON.stringify(res.data);
            }
        });
    }
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 锁定issue
 */
const lockIssueDao = async (userName, repository, number, locked) => {
    let fullName = userName + "/" + repository;
    let url = Address.lockIssue(userName, repository, number);
    let res = await Api.netFetch(url, locked ? "DELETE" : 'PUT', {}, true, {Accept: 'application/vnd.github.VERSION.full+json'});
    let objectData = null;
    if (res && res.result) {
        realm.write(() => {
            let items = realm.objects('IssueDetail').filtered(`fullName="${fullName}" AND number ="${number}"`);
            if (items && items.length > 0) {
                let resultData = items[0].data;
                if (resultData) {
                    objectData = JSON.parse(resultData);
                    objectData.locked = !locked;
                    items[0].data = JSON.stringify(objectData);
                }
            }
        });
    }
    return {
        data: objectData,
        result: res.result
    };
};

/**
 * 创建issue
 */
const createIssueDao = async (userName, repository, issue) => {
    let fullName = userName + "/" + repository;
    let url = Address.createIssue(userName, repository);
    let res = await Api.netFetch(url, 'POST', issue, true, {Accept: 'application/vnd.github.VERSION.full+json'});
    if (res && res.result) {
        realm.write(() => {
            realm.create('IssueDetail', {
                number: res.data.number + "",
                fullName: fullName,
                data: JSON.stringify(res.data)
            });
        });
    }
    return {
        data: res.data,
        result: res.result
    };
};


/**
 * 编辑issue回复
 */
const editCommentDao = async (userName, repository, number, commentId, comment) => {
    let fullName = userName + "/" + repository;
    let url = Address.editComment(userName, repository, commentId);
    let res = await Api.netFetch(url, 'PATCH', comment, true, {Accept: 'application/vnd.github.VERSION.full+json'});
    if (res && res.result) {
        realm.write(() => {
            let items = realm.objects('IssueComment').filtered(`fullName="${fullName}" AND number ="${number}" AND commentId="${commentId}"`);
            if (items && items.length > 0) {
                items[0].data = JSON.stringify(res.data);
            }
        });
    }
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 删除issue回复
 */
const deleteCommentDao = async (userName, repository, number, commentId) => {
    let fullName = userName + "/" + repository;
    let url = Address.editComment(userName, repository, commentId);
    let res = await Api.netFetch(url, 'DELETE', null, true, {Accept: 'application/vnd.github.VERSION.full+json'});
    if (res && res.result) {
        realm.write(() => {
            let items = realm.objects('IssueComment').filtered(`fullName="${fullName}" AND number ="${number}" AND commentId="${commentId}"`);
            realm.delete(items)
        });
    }
    return {
        data: res.data,
        result: res.result
    };
};


export default {
    getRepositoryIssueDao,
    getIssueCommentDao,
    getIssueInfoDao,
    addIssueCommentDao,
    editIssueDao,
    editCommentDao,
    deleteCommentDao,
    createIssueDao,
    lockIssueDao
}