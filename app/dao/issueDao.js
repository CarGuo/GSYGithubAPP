/**
 * Created by guoshuyu on 2017/11/17.
 */


import Api from '../net'
import Address from '../net/address'


const getRepositoryIssueDao = async (page = 0, userName, repository, state, sort, direction) => {
    let url = Address.getReposIssue(userName, repository, state, sort, direction) + Address.getPageParams("&", page);
    let res = await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

export default {
    getRepositoryIssueDao,
}