/**
 * Created by guoshuyu on 2017/11/15.
 */

import {REPOSITORY} from '../type'
import RepositoryDao from '../../dao/repositoryDao'
import {Buffer} from 'buffer'
import {generateMd2Html} from "../../utils/htmlUtils";
import realm from "../../dao/db";
import * as Config from "../../config";

/**
 * 趋势数据
 * @param page 分页，趋势数据其实没有分页
 * @param since 数据时长， 本日，本周，本月
 * @param languageType 语言
 * @param callback
 */
const getTrend = (page = 0, since = 'daily', languageType, callback) => async (dispatch, getState) => {
    let resLocal = await RepositoryDao.getTrendDao(page, since, languageType, true);
    if (resLocal && resLocal.result && resLocal.data.length > 0) {
        dispatch({
            type: REPOSITORY.TREND_REPOSITORY,
            res: resLocal.data
        });
    }
    let res = await resLocal.next();
    if (res && res.result) {
        dispatch({
            type: REPOSITORY.TREND_REPOSITORY,
            res: res.data
        });
        callback && callback(res.data);
    } else {
        callback && callback(null);
    }
};


/**
 * Pulse
 */
const getPulse = async (owner, repositoryName) => {
    let resLocal = await RepositoryDao.getPulseDao(owner, repositoryName);
    return resLocal;
};

/**
 * 搜索仓库
 * @param q 搜索关键字
 * @param language 语言
 * @param sort 分类排序，beat match、most star等
 * @param order 倒序或者正序
 * @param type 搜索类型，人或者仓库
 * @param page
 * @param pageSize
 * @returns {Promise.<{result, data}>}
 */
const searchRepository = async (q, language, sort, order, type, page = 1, pageSize) => {
    if (language) {
        q = q + `%2Blanguage%3A${language}`;
    }
    let res = await RepositoryDao.searchRepositoryDao(q, sort, order, type, page, pageSize);
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 搜索仓库issue
 * @param q 搜索关键字
 * @param name 用户名
 * @param reposName 仓库名
 * @param page
 * @param state 问题状态，all open closed
 * @returns {Promise.<{result, data}>}
 */
const searchRepositoryIssue = async (q, name, reposName, page = 1, state) => {
    let qu;
    if (!state || state === 'all') {
        qu = q + `+repo%3A${name}%2F${reposName}`;
    } else {
        qu = q + `+repo%3A${name}%2F${reposName}+state%3A${state}`;
    }

    let res = await RepositoryDao.searchRepositoryIssueDao(qu, page);
    return {
        result: res.result,
        data: res.data
    }
};

/**
 * 用户自己的仓库
 */
const getUserRepository = async (userName, page = 1, sort) => {
    if (page <= 1) {
        return RepositoryDao.getUserRepositoryDao(userName, page, sort, true);
    } else {
        return RepositoryDao.getUserRepositoryDao(userName, page, sort)
    }
};

/**
 * 用户收藏的
 */
const getStarRepository = async (userName, page = 1, sort) => {
    if (page <= 1) {
        return RepositoryDao.getStarRepositoryDao(userName, page, sort, true);
    } else {
        return RepositoryDao.getStarRepositoryDao(userName, page, sort)
    }
};

/**
 * 仓库详情
 */
const getRepositoryDetail = async (userName, reposName) => {
    return RepositoryDao.getRepositoryDetailDao(userName, reposName);
};

/**
 * 仓库的fork分支
 */
const getRepositoryForks = async (userName, reposName, page = 1) => {
    if (page <= 1) {
        return RepositoryDao.getRepositoryForksDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getRepositoryForksDao(userName, reposName, page);
    }
};

/**
 * 创建仓库的fork分支
 */
const createRepositoryForks = async (userName, reposName) => {
    let res = await RepositoryDao.createForkDao(userName, reposName);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 获取当前仓库所有分支
 */
const getBranches = async (userName, reposName) => {
    return RepositoryDao.getBranchesDao(userName, reposName);
};

/**
 * 获取当前仓库所有star用户
 */
const getRepositoryStar = async (userName, reposName, page = 1) => {
    if (page <= 1) {
        return RepositoryDao.getRepositoryStarDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getRepositoryStarDao(userName, reposName, page);
    }
};

/**
 * 获取当前仓库所有订阅用户
 */
const getRepositoryWatcher = async (userName, reposName, page = 1) => {
    if (page <= 1) {
        return RepositoryDao.getRepositoryWatcherDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getRepositoryWatcherDao(userName, reposName, page);
    }
};

/**
 * 获取用户对当前仓库的star、watcher状态
 */
const getRepositoryStatus = async (userName, reposName) => {
    let res = await RepositoryDao.getRepositoryStatusDao(userName, reposName);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * star仓库
 */
const doRepositoryStar = async (userName, reposName, star) => {
    let res = await RepositoryDao.doRepositoryStarDao(userName, reposName, star);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * watcher仓库
 */
const doRepositoryWatch = async (userName, reposName, watch) => {
    let res = await RepositoryDao.doRepositoryWatchDao(userName, reposName, watch);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 获取仓库的release列表
 */
const getRepositoryRelease = async (userName, reposName, page = 1, needHtml = true) => {
    let res = await RepositoryDao.getRepositoryReleaseDao(userName, reposName, page, needHtml);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 获取仓库的tag列表
 */
const getRepositoryTag = async (userName, reposName, page = 1) => {
    let res = await RepositoryDao.getRepositoryTagDao(userName, reposName, page);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 获取仓库的提交列表
 */
const getReposCommits = async (page = 0, userName, reposName) => {
    if (page <= 1) {
        return RepositoryDao.getReposCommitsDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getReposCommitsDao(userName, reposName, page);
    }
};

/**
 * 获取仓库的单个提交详情
 */
const getReposCommitsInfo = async (userName, reposName, sha) => {
    return RepositoryDao.getReposCommitsInfoDao(userName, reposName, sha);
};


/**
 * 详情的remde数据
 */
const getRepositoryDetailReadme = async (userName, reposName, branch) => {
    let res = await RepositoryDao.getRepositoryDetailReadmeDao(userName, reposName, branch);
    if (res.result) {
        let b = Buffer(res.data.content, 'base64');
        let data = b.toString('utf8');
        return {
            result: true,
            data: generateMd2Html(data, userName, reposName, branch)
        }
    } else {
        return {
            result: false,
            data: ""
        }
    }
};

/**
 * 详情的remde数据Html模式数据
 */
const getRepositoryDetailReadmeHtml = async (userName, reposName, branch) => {
    let res = RepositoryDao.getRepositoryDetailReadmeHtmlDao(userName, reposName, branch);
    if (res.result) {
        return {
            result: true,
            data: res.data,
            next: res.next
        }
    } else {
        return {
            result: false,
            data: "",
            next: res.next
        }
    }
};

/***
 * 获取仓库的文件列表
 */
const getReposFileDir = async (userName, reposName, path, branch, text) => {
    let res = await RepositoryDao.getReposFileDirDao(userName, reposName, path, branch, text);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 添加到本地已读数据列表
 */
const addRepositoryLocalRead = async (userName, reposName, data) => {
    RepositoryDao.addRepositoryLocalReadDao(userName, reposName, data);
};

/**
 * 获取本地已读数据列表
 */
const getRepositoryLocalRead = async (page = 1) => {
    let res = RepositoryDao.getRepositoryLocalReadDao(page);
    return {
        result: true,
        data: res.data,
    }
};

/**
 * 搜索话题
 */
const searchTopicRepository = async (searchTopic, page = 0) => {
    let res = await RepositoryDao.searchTopicRepositoryDao(searchTopic, page);
    return {
        data: res.data,
        result: res.result
    }
};

/**
 * 用户的前100仓库
 */
const getUserRepository100Status = async (userName) => {
    let res = await RepositoryDao.getUserRepository100StatusDao(userName);
    return {
        data: res.data,
        result: res.result
    }
};


export default {
    getTrend,
    searchRepository,
    getUserRepository,
    getStarRepository,
    getRepositoryDetail,
    getRepositoryDetailReadme,
    getRepositoryDetailReadmeHtml,
    getRepositoryForks,
    getRepositoryStar,
    getRepositoryWatcher,
    getRepositoryStatus,
    doRepositoryStar,
    doRepositoryWatch,
    getRepositoryRelease,
    getReposCommits,
    getReposCommitsInfo,
    getRepositoryTag,
    getReposFileDir,
    searchRepositoryIssue,
    createRepositoryForks,
    getBranches,
    getRepositoryLocalRead,
    addRepositoryLocalRead,
    searchTopicRepository,
    getUserRepository100Status,
    getPulse

}
