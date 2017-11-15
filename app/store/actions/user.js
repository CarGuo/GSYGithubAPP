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
import {AsyncStorage} from 'react-native'
import Api from '../../funtion/net'
import Address from '../../funtion/net/address'
import {LOGIN} from '../type'
import * as Constant from '../../style/constant'
import {Buffer} from 'buffer'

const create = (userInfo) => (dispatch, getState) => {

};

const getEventReceived = () => async(dispatch, getState) => {
    let res = await Api.netFetch(Address.getEventReceived('CarGuo'));
    console.log(res)
};

export default {
    create,
    getEventReceived
}