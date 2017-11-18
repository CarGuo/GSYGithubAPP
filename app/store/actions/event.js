/**
 * Created by guoshuyu on 2017/11/16.
 */


import {AsyncStorage} from 'react-native'
import Api from '../../net'
import Address from '../../net/address'
import {EVENT} from '../type'
import * as Constant from '../../style/constant'
import {Buffer} from 'buffer'
import EventDao from '../../dao/eventDao'

const getEventReceived = (page = 0, callback) => async (dispatch, getState) => {
    let user = getState()['user'];
    if (!user && user.userInfo) {
        //todo 提示用户信息异常
        callback && callback(null);
        return;
    }
    let res = await EventDao.getEventReceivedFromNet(page, user.userInfo.login);
    if (res && res.result) {
        callback && callback(res.data);
        dispatch({
            type: EVENT.RECEIVED_EVENTS,
            res: res.data
        });
    } else {
        callback && callback(null);
    }
};


export default {
    getEventReceived,
}
