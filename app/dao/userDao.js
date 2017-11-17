import {AsyncStorage} from 'react-native'
import Api from '../net'
import Address from '../net/address'
import {USER} from '../store/type'
import * as Constant from '../style/constant'

/**
 *
 */
const getUserInfoLocal = async() => {
    let userText = await AsyncStorage.getItem(Constant.USER_INFO);
    if (userText) {
        let res = JSON.parse(userText);
        return {
            result: true,
            data:res
        }
    } else {
        return {
            result: false
        }
    }
};



const getUserInfoNet = async() => {
    let res = await Api.netFetch(Address.getMyUserInfo());
    if (res && res.result) {
        AsyncStorage.setItem(Constant.USER_INFO, JSON.stringify(res.data));
        return {
            result: true,
            data:res
        }
    } else {
        return {
            result: false,
            data:res
        }
    }
};


export default {
    getUserInfoLocal,
    getUserInfoNet,
}
