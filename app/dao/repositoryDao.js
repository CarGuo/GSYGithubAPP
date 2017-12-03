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

const getRepositoryDetailDao = async (userName, reposName) => {
    let url = Address.getReposDetail(userName, reposName);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryDetailReadmeDao = async (userName, reposName, branch) => {
    let url = Address.readmeFile(userName + '/' + reposName, branch);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryForksDao = async (userName, reposName, page) => {
    let url = Address.getReposForks(userName, reposName) + Address.getPageParams("?", page);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryStarDao = async (userName, reposName, page) => {
    let url = Address.getReposStar(userName, reposName) + Address.getPageParams("?", page);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryWatcherDao = async (userName, reposName, page) => {
    let url = Address.getReposWatcher(userName, reposName) + Address.getPageParams("?", page);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryStatusDao = async (userName, reposName) => {
    let urls = Address.resolveStarRepos(userName, reposName);
    let urlw = Address.resolveWatcherRepos(userName, reposName);
    let ress = await await Api.netFetch(urls);
    let resw = await await Api.netFetch(urlw);
    return {
        data: {star: ress.result, watch: resw.result},
        result: true
    };
};

const doRepositoryStarDao = async (userName, reposName, star) => {
    let url = Address.resolveStarRepos(userName, reposName);
    let res = await await Api.netFetch(url, star ? 'PUT' : 'DELETE');
    return {
        data: res.result,
        result: res.result
    };
};

const doRepositoryWatchDao = async (userName, reposName, watch) => {
    let url = Address.resolveWatcherRepos(userName, reposName);
    let res = await await Api.netFetch(url, watch ? 'PUT' : 'DELETE');
    return {
        data: res.result,
        result: res.result
    };
};

const getRepositoryReleaseDao = async (userName, reposName) => {
    let url = Address.getReposRelease(userName, reposName);
    let res = await await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryTagDao = async (userName, reposName) => {
    let url = Address.getReposTag(userName, reposName);
    let res = await await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
    return {
        data: res.data,
        result: res.result
    };
};


const getReposCommitsDao = async (userName, reposName, page) => {
    let url = Address.getReposCommits(userName, reposName) + Address.getPageParams("?", page);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getReposCommitsInfoDao = async (userName, reposName, sha) => {
    let url = Address.getReposCommitsInfo(userName, reposName, sha);
    let res = await await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getReposFileDirDao = async (userName, reposName, path = '', branch) => {
    let url = Address.reposDataDir(userName, reposName, path, branch);
    let res = await await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html'});
    return {
        data: res.data,
        result: res.result
    };
};

export default {
    getTrendDao,
    searchRepositoryDao,
    getUserRepositoryDao,
    getStarRepositoryDao,
    getRepositoryDetailDao,
    getRepositoryDetailReadmeDao,
    getRepositoryForksDao,
    getRepositoryStarDao,
    getRepositoryWatcherDao,
    getRepositoryStatusDao,
    doRepositoryStarDao,
    doRepositoryWatchDao,
    getRepositoryReleaseDao,
    getReposCommitsDao,
    getReposCommitsInfoDao,
    getRepositoryTagDao,
    getReposFileDirDao,
}