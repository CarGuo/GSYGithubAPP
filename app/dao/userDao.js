import {AsyncStorage} from 'react-native'
import Api from '../net'
import Address from '../net/address'
import {USER} from '../store/type'
import * as Constant from '../style/constant'

/**
 *
 */
const getUserInfoLocal = async () => {
    let userText = await AsyncStorage.getItem(Constant.USER_INFO);
    if (userText) {
        let res = JSON.parse(userText);
        return {
            result: true,
            data: res
        }
    } else {
        return {
            result: false
        }
    }
};


const getUserInfoNet = async () => {
    let res = await Api.netFetch(Address.getMyUserInfo());
    if (res && res.result) {
        let countRes = await getUserStaredCountNet(res.data.login);
        let starred = "---";
        if (countRes.result) {
            starred = countRes.data;
        }
        let totalInfo = Object.assign({}, res.data, {starred: starred});
        AsyncStorage.setItem(Constant.USER_INFO, JSON.stringify(totalInfo));
        return {
            result: true,
            data: totalInfo
        }
    } else {
        return {
            result: false,
            data: res.data
        }
    }
};

/**
 * 在header中提起stared count
 */
const getUserStaredCountNet = async (userName) => {
    let res = await Api.netFetch(Address.userStar(userName) + "&per_page=1");
    if (res && res.result && res.headers && res.headers.map) {
        try {
            let link = res.headers.map['link'];
            if (link && (typeof link) === 'object') {
                let indexStart = link[0].lastIndexOf("page=") + 5;
                let indexEnd = link[0].lastIndexOf(">");
                if (indexStart >= 0 && indexEnd >= 0) {
                    let count = link[0].substring(indexStart, indexEnd);
                    return {
                        result: true,
                        data: count
                    }
                }
            }
            return {
                result: true,
            }
        } catch (e) {
            console.log(e)
        }
        return {
            result: false,
        }
    } else {
        return {
            result: false,
        }
    }
};


export default {
    getUserInfoLocal,
    getUserInfoNet,
    getUserStaredCountNet
}
