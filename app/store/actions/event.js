/**
 * Created by guoshuyu on 2017/11/16.
 */

import {EVENT} from '../type'
import EventDao from '../../dao/eventDao'

const getEventReceived = (page = 0, callback) => async (dispatch, getState) => {
    let user = getState()['user'];
    if (!user || !user.userInfo || !user.userInfo.login) {
        callback && callback(null);
        return;
    }
    if (page <= 1) {
        let resLocal = await EventDao.getEventReceivedDao(page, user.userInfo.login, true);
        if (resLocal && resLocal.result) {
            dispatch({
                type: EVENT.RECEIVED_EVENTS,
                res: resLocal.data
            });
        }
    }
    let res = await EventDao.getEventReceivedDao(page, user.userInfo.login);
    if (res && res.result) {
        if (page === 0) {
            dispatch({
                type: EVENT.RECEIVED_EVENTS,
                res: res.data
            });
        } else {
            let event = getState()['event'].received_events_data_list;
            dispatch({
                type: EVENT.RECEIVED_EVENTS,
                res: event.concat(res.data)
            });
        }
        callback && callback(res.data);
    } else {
        callback && callback(null);
    }
};


const getEvent = async (page = 0, userName) => {
    if (!userName) {
        return null;
    }
    let res = await EventDao.getEventFromNet(page, userName);
    return res;
};


const getRepositoryEvent = async (page = 0, userName, repository) => {
    let res = await EventDao.getRepositoryEventDao(page, userName, repository);
    if (res && res.result) {
        return {
            data: res.data,
            result: true
        };
    } else {
        return {
            result: false
        };
    }

};

export default {
    getEventReceived,
    getEvent,
    getRepositoryEvent,
}
