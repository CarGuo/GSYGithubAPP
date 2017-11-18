/**
 * Created by guoshuyu on 2017/11/16.
 */

import {EVENT} from '../type';
import {createReducer} from '../'

const initialState = {
    received_events_data_list: [],
    received_events_current_size: 0,
};

const actionHandler = {
    [EVENT.RECEIVED_EVENTS]: (state, action) => {
        return {
            ...state,
            received_events_data_list: action.res,
            received_events_current_size: action.res.length
        }
    },
};

export default createReducer(initialState, actionHandler)
