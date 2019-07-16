/**
 * 从https://github.com/trending获取数据
 * 项目地址:https://github.com/crazycodeboy/GitHubTrending
 * 博客地址:http://www.devio.org
 * @flow
 */
import TrendingUtil from './TrendingUtil';
import * as Code from '../../net/netwrokCode'
import I18n from '../../style/i18n'



class GitHubTrending {

    fetchTrending(url) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                resolve({
                    result: false,
                    status: Code.NETWORK_TIMEOUT,
                    message: I18n('netTimeout')
                })
            }, 15000);
            fetch(url)
                .then((response) => {
                    clearTimeout(timeoutId);
                    return response.text()
                })
                .catch((error) => {
                    clearTimeout(timeoutId);
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

export default new GitHubTrending();
