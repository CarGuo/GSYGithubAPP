import Api from '../net'
import Address from '../net/address'
import GitHubTrending from '../utils/trending/GitHubTrending'

const getTrendDao = async (page = 0, since) => {
    let url = Address.trending(since);
    let res = await new GitHubTrending().fetchTrending(url);
    return {
        data: res.data,
        result: res.result
    };
};


export default {
    getTrendDao,
}