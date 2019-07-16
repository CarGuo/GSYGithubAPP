/**
 * Created by guoshuyu on 2017/11/16.
 */

import {EVENT} from '../type'
import EventDao from '../../dao/eventDao'

/**
 * 用户接收事件
 */
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

/**
 * 用户行为事件
 */
const getEvent = async (page = 0, userName) => {
    if (!userName) {
        return null;
    }
    if (page <= 1) {
        return EventDao.getEventDao(page, userName, true);
    }
    return EventDao.getEventDao(page, userName);
};

/**
 * 仓库活动事件
 */
const getRepositoryEvent = async (page = 0, userName, repository) => {
    if (page <= 1) {
        return EventDao.getRepositoryEventDao(page, userName, repository, true);
    }
    return await EventDao.getRepositoryEventDao(page, userName, repository);
};

export default {
    getEventReceived,
    getEvent,
    getRepositoryEvent,
}
