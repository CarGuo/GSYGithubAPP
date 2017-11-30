import IssueDao from '../../dao/issueDao'


const getRepositoryIssue = async (page = 0, userName, repository, state, sort, direction) => {
    let res = await IssueDao.getRepositoryIssueDao(page, userName, repository, state, sort, direction);
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

const getIssueComment = async (page = 0, userName, repository, number) => {
    let res = await IssueDao.getIssueCommentDao(page, userName, repository, number);
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

const getIssueInfo = async (userName, repository, number) => {
    let res = await IssueDao.getIssueInfoDao(userName, repository, number);
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

export default {
    getRepositoryIssue,
    getIssueComment,
    getIssueInfo,
    addIssueComment
}
