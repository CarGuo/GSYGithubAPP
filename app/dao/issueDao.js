/**
 * Created by guoshuyu on 2017/11/17.
 */


import Api from '../net'
import Address from '../net/address'


const getRepositoryIssueDao = async (page = 0, userName, repository, state, sort, direction) => {
    let url = Address.getReposIssue(userName, repository, state, sort, direction) + Address.getPageParams("&", page);
    let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
    return {
        data: res.data,
        result: res.result
    };
};

const getIssueCommentDao = async (page = 0, userName, repository, number) => {
    let url = Address.getIssueComment(userName, repository, number) + Address.getPageParams("?", page);
    let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
    return {
        data: res.data,
        result: res.result
    };
};

const getIssueInfoDao = async (userName, repository, number) => {
    let url = Address.getIssueInfo(userName, repository, number);
    let res = await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
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
    let res = await Api.netFetch(url, 'PATCH',  issue, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
    return {
        data: res.data,
        result: res.result
    };
};

const editCommentDao = async (userName, repository, commentId, comment) => {
    let url = Address.editComment(userName, repository, commentId);
    let res = await Api.netFetch(url, 'PATCH',  comment, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
    return {
        data: res.data,
        result: res.result
    };
};

const deleteCommentDao = async (userName, repository, commentId) => {
    let url = Address.editComment(userName, repository, commentId);
    let res = await Api.netFetch(url, 'DELETE',  null, true, {Accept: 'application/vnd.github.VERSION.raw+json'});
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
}