import Api from '../net'
import Address from '../net/address'
import GitHubTrending from '../utils/trending/GitHubTrending'

const getTrendDao = async (page = 0, since, languageType) => {
    let url = Address.trending(since, languageType);
    let res = await new GitHubTrending().fetchTrending(url);
    return {
        data: res.data,
        result: res.result
    };
};

const searchRepositoryDao = async (q, sort, order, page, pageSize) => {
    let url = Address.sreach(q, sort, order, page, pageSize);
    let res = await await Api.netFetch(url);
    return {
        data: res.data ? res.data.items : res.data,
        result: res.result
    };
};

const getUserRepositoryDao = async (userName, page) => {
    let url = Address.userRepos(userName) + Address.getPageParams("&", page);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getStarRepositoryDao = async (userName, page) => {
    let url = Address.userStar(userName) + Address.getPageParams("&", page);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};


export default {
    getTrendDao,
    searchRepositoryDao,
    getUserRepositoryDao,
    getStarRepositoryDao
}