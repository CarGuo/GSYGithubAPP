/**
 * Created by guoshuyu on 2017/11/9.
 */
/**
 {
     "login": "CarGuo",
     "id": 10770362,
     "avatar_url": "https://avatars3.githubusercontent.com/u/10770362?v=4",
     "gravatar_id": "",
     "url": "https://api.github.com/users/CarGuo",
     "html_url": "https://github.com/CarGuo",
     "followers_url": "https://api.github.com/users/CarGuo/followers",
     "following_url": "https://api.github.com/users/CarGuo/following{/other_user}",
     "gists_url": "https://api.github.com/users/CarGuo/gists{/gist_id}",
     "starred_url": "https://api.github.com/users/CarGuo/starred{/owner}{/repo}",
     "subscriptions_url": "https://api.github.com/users/CarGuo/subscriptions",
     "organizations_url": "https://api.github.com/users/CarGuo/orgs",
     "repos_url": "https://api.github.com/users/CarGuo/repos",
     "events_url": "https://api.github.com/users/CarGuo/events{/privacy}",
     "received_events_url": "https://api.github.com/users/CarGuo/received_events",
     "type": "User",
     "site_admin": false,
     "name": "Shuyu Guo",
     "company": "远光软件",
     "blog": "http://www.jianshu.com/users/6e613846e1ea/latest_articles",
     "location": "China",
     "email": null,
     "hireable": true,
     "bio": "一个爱猫的程序猿老司机。",
     "public_repos": 23,
     "public_gists": 0,
     "followers": 631,
     "following": 1,
     "created_at": "2015-01-30T08:39:59Z",
     "updated_at": "2017-11-11T01:41:59Z",
     "private_gists": 0,
     "total_private_repos": 0,
     "owned_private_repos": 0,
     "disk_usage": 359910,
     "collaborators": 0,
     "two_factor_authentication": false,
     "plan": {
         "name": "free",
         "space": 976562499,
         "collaborators": 0,
         "private_repos": 0
     }
 }
 **/
import {USER} from '../type'
import UserDao from '../../dao/userDao'
import * as Constant from '../../style/constant'
import store from '../'
import {AsyncStorage} from 'react-native'

const {dispatch, getState} = store;

/**
 * 初始化用户信息
 */
const initUserInfo = async () => {
    let token = await AsyncStorage.getItem(Constant.TOKEN_KEY);
    let res = await UserDao.getUserInfoLocal();
    if (res && res.result && token) {
        dispatch({
            type: USER.USER_INFO,
            res: res.data
        });
    }
    return {
        result: res.result && (token !== null),
        data: res.data
    };

};

const getUserInfo = () => {
    UserDao.getUserInfoNet().then((res) => {
        if (res && res.result) {
            dispatch({
                type: USER.USER_INFO,
                res: res.data
            });
        }
    });
};

const clearUserInfo = () => {
    AsyncStorage.removeItem(Constant.USER_INFO);
    dispatch({
        type: USER.USER_INFO,
        res: null
    });
};


export default {
    initUserInfo,
    getUserInfo,
    clearUserInfo
}
