import IssueDao from '../../dao/issueDao'


const getRepositoryIssue = async (page = 0, userName, repository, state, sort, direction) => {
    if (page <= 1) {
        return IssueDao.getRepositoryIssueDao(page, userName, repository, state, sort, direction, true);
    }
    return IssueDao.getRepositoryIssueDao(page, userName, repository, state, sort, direction);
};

const getIssueComment = async (page = 0, userName, repository, number) => {
    if (page <= 1) {
        return IssueDao.getIssueCommentDao(page, userName, repository, number, true);
    }
    return IssueDao.getIssueCommentDao(page, userName, repository, number)

};

const getIssueInfo = async (userName, repository, number) => {
    return IssueDao.getIssueInfoDao(userName, repository, number);
};

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
const createIssue = async (userName, repository, issue) => {
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


const editComment = async (userName, repository, commentId, comment, type) => {
    let res;
    if (type === 'delete') {
        res = await IssueDao.deleteCommentDao(userName, repository, commentId);
    } else {
        res = await IssueDao.editCommentDao(userName, repository, commentId, comment);
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
    createIssue
}
