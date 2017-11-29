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

export default {
    getRepositoryIssue,
}
