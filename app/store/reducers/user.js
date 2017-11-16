/**
 * Created by guoshuyu on 2017/11/16.
 */
import {USER} from '../type';
import {createReducer} from '../'

const initialState = {
    received_events_data_list: {},
};

const actionHandler = {
    [USER.RECEIVED_EVENTS]: (state, action) => {
       return {
          ...state,
          received_events_data_list: action.res,
          received_events_current_size: action.res.lenght
       }
    },
};

export default createReducer(initialState, actionHandler)
