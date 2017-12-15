import {REPOSITORY} from '../type';
import {createReducer} from '../'

const initialState = {
    //当前趋势列表
    trend_repos_data_list: [],
    trend_repos_current_size: 0,
};

const actionHandler = {
    [REPOSITORY.TREND_REPOSITORY]: (state, action) => {
        return {
            ...state,
            trend_repos_data_list: action.res,
            trend_repos_current_size: action.res.length
        }
    },
};

export default createReducer(initialState, actionHandler)