import Api from '../net'
import Address from '../net/address'
import GitHubTrending from '../utils/trending/GitHubTrending'

const getTrendDao = async (page = 0, since, languageType) => {
    let url = Address.trending(since, languageType);

    console.log('************',url);
    let res = await new GitHubTrending().fetchTrending(url);
    console.log('************',res);
    return {
        data: res.data,
        result: res.result
    };
};


export default {
    getTrendDao,
}