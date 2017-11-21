/**
 * 从https://github.com/trending获取数据
 * 项目地址:https://github.com/crazycodeboy/GitHubTrending
 * 博客地址:http://www.devio.org
 * @flow
 */
import TrendingUtil from './TrendingUtil';

export default class GitHubTrending {
    GitHubTrending() {//Singleton pattern
        if (typeof GitHubTrending.instance === 'object') {
            return GitHubTrending.instance;
        }
        GitHubTrending.instance = this;
    }

    fetchTrending(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.text())
                .catch((error) => {
                    reject({result: false, data: error});
                    console.log(error);
                }).then((responseData) => {
                try {
                    resolve({result: true, data: TrendingUtil.htmlToRepo(responseData)});
                } catch (e) {
                    reject({result: false, data: e});
                }
            }).done();
        });
    }


}
