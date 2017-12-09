/**
 * Created by guoshuyu on 2017/11/15.
 */

import {REPOSITORY} from '../type'
import RepositoryDao from '../../dao/repositoryDao'
import {Buffer} from 'buffer'
import {generateMd2Html, generateHtml} from "../../utils/htmlUtils";

/**
 * 趋势数据
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
 * 搜索仓库
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
 * 搜索仓库
 */
const searchRepositoryIssue = async (q, name, reposName, page = 1) => {
    let qu = q + `%2Brepo%3A${name}%2F${reposName}`;
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
 * 详情
 */
const getRepositoryDetail = async (userName, reposName) => {
    return RepositoryDao.getRepositoryDetailDao(userName, reposName);
};


const getRepositoryForks = async (userName, reposName, page = 1) => {
    if (page <= 1) {
        return RepositoryDao.getRepositoryForksDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getRepositoryForksDao(userName, reposName, page);
    }
};

const createRepositoryForks = async (userName, reposName) => {
    let res = await RepositoryDao.createForkDao(userName, reposName);
    return {
        data: res.data,
        result: res.result
    };
};

const getBranches = async (userName, reposName) => {
    return RepositoryDao.getBranchesDao(userName, reposName);
};


const getRepositoryStar = async (userName, reposName, page = 1) => {
    if (page <= 1) {
        return RepositoryDao.getRepositoryStarDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getRepositoryStarDao(userName, reposName, page);
    }
};

const getRepositoryWatcher = async (userName, reposName, page = 1) => {
    if (page <= 1) {
        return RepositoryDao.getRepositoryWatcherDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getRepositoryWatcherDao(userName, reposName, page);
    }
};

const getRepositoryStatus = async (userName, reposName) => {
    let res = await RepositoryDao.getRepositoryStatusDao(userName, reposName);
    return {
        data: res.data,
        result: res.result
    };
};

const doRepositoryStar = async (userName, reposName, star) => {
    let res = await RepositoryDao.doRepositoryStarDao(userName, reposName, star);
    return {
        data: res.data,
        result: res.result
    };
};


const doRepositoryWatch = async (userName, reposName, watch) => {
    let res = await RepositoryDao.doRepositoryWatchDao(userName, reposName, watch);
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryRelease = async (userName, reposName) => {
    let res = await RepositoryDao.getRepositoryReleaseDao(userName, reposName);
    return {
        data: res.data,
        result: res.result
    };
};


const getRepositoryTag = async (userName, reposName) => {
    let res = await RepositoryDao.getRepositoryTagDao(userName, reposName);
    return {
        data: res.data,
        result: res.result
    };
};


const getReposCommits = async (page = 0, userName, reposName) => {
    if (page <= 1) {
        return RepositoryDao.getReposCommitsDao(userName, reposName, page, true);
    } else {
        return RepositoryDao.getReposCommitsDao(userName, reposName, page);
    }
};

const getReposCommitsInfo = async (userName, reposName, sha) => {
    let res = await RepositoryDao.getReposCommitsInfoDao(userName, reposName, sha);
    return {
        data: res.data,
        result: res.result
    };
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
 * 详情的remde数据
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

const getReposFileDir = async (userName, reposName, path, branch) => {
    let res = await RepositoryDao.getReposFileDirDao(userName, reposName, path, branch);
    return {
        data: res.data,
        result: res.result
    };
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
    getBranches

}
