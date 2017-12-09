/**
 * Created by guoshuyu on 2017/11/17.
 */


import Api from '../net'
import Address from '../net/address'
import realm from "./db";


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

const addIssueCommentDao = async (userName, repository, number, comment) => {
    let url = Address.addIssueComment(userName, repository, number);
    let res = await Api.netFetch(url, 'POST', {body: comment}, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
    return {
        data: res.data,
        result: res.result
    };
};

const editIssueDao = async (userName, repository, number, issue) => {
    let url = Address.editIssue(userName, repository, number);
    let res = await Api.netFetch(url, 'PATCH', issue, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
    return {
        data: res.data,
        result: res.result
    };
};

const createIssueDao = async (userName, repository, issue) => {
    let url = Address.createIssue(userName, repository);
    let res = await Api.netFetch(url, 'POST', issue, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
    return {
        data: res.data,
        result: res.result
    };
};

const editCommentDao = async (userName, repository, commentId, comment) => {
    let url = Address.editComment(userName, repository, commentId);
    let res = await Api.netFetch(url, 'PATCH', comment, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
    return {
        data: res.data,
        result: res.result
    };
};

const deleteCommentDao = async (userName, repository, commentId) => {
    let url = Address.editComment(userName, repository, commentId);
    let res = await Api.netFetch(url, 'DELETE', null, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
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
    createIssueDao
}