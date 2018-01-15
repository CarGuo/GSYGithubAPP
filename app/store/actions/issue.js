import IssueDao from '../../dao/issueDao'

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
const getRepositoryIssue = async (page = 0, userName, repository, state, sort, direction) => {
    if (page <= 1) {
        return IssueDao.getRepositoryIssueDao(page, userName, repository, state, sort, direction, true);
    }
    return IssueDao.getRepositoryIssueDao(page, userName, repository, state, sort, direction);
};

/**
 * issue的回复列表
 */
const getIssueComment = async (page = 0, userName, repository, number) => {
    if (page <= 1) {
        return IssueDao.getIssueCommentDao(page, userName, repository, number, true);
    }
    return IssueDao.getIssueCommentDao(page, userName, repository, number)

};

/**
 * issue的详请
 */
const getIssueInfo = async (userName, repository, number) => {
    return IssueDao.getIssueInfoDao(userName, repository, number);
};

/**
 * 增加issue的回复
 */
const addIssueComment = async (userName, repository, number, comment) => {
    let res = await IssueDao.addIssueCommentDao(userName, repository, number, comment);
    if (res && res.result) {
        return {
            data: res.data,
            result: true
        };
    } else {
        return {
            result: false
        };
    }
};

/**
 * 编辑issue
 */
const editIssue = async (userName, repository, number, issue) => {
    let res = await IssueDao.editIssueDao(userName, repository, number, issue);
    if (res && res.result) {
        return {
            data: res.data,
            result: true
        };
    } else {
        return {
            result: false
        };
    }
};

/**
 * 锁定issue
 */
const lockIssue = async (userName, repository, number, locked) => {
    let res = await IssueDao.lockIssueDao(userName, repository, number, locked);
    if (res && res.result) {
        return {
            data: res.data,
            result: true
        };
    } else {
        return {
            result: false
        };
    }
};


/**
 * 创建issue
 */
const createIssue = async (userName, repository,  issue) => {
    let res = await IssueDao.createIssueDao(userName, repository, issue);
    if (res && res.result) {
        return {
            data: res.data,
            result: true
        };
    } else {
        return {
            result: false
        };
    }
};

/**
 * 编辑issue回复
 */
const editComment = async (userName, repository, number, commentId, comment, type) => {
    let res;
    if (type === 'delete') {
        res = await IssueDao.deleteCommentDao(userName, repository, number, commentId);
    } else {
        res = await IssueDao.editCommentDao(userName, repository, number, commentId, comment);
    }
    if (res && res.result) {
        return {
            data: res.data,
            result: true
        };
    } else {
        return {
            result: false
        };
    }
};


export default {
    getRepositoryIssue,
    getIssueComment,
    getIssueInfo,
    addIssueComment,
    editIssue,
    editComment,
    createIssue,
    lockIssue
}
