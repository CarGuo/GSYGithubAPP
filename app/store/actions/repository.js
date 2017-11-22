/**
 * Created by guoshuyu on 2017/11/15.
 */

import {REPOSITORY} from '../type'
import RepositoryDao from '../../dao/repositoryDao'

const getTrend = (page = 0, since = 'daily', languageType, callback) => async (dispatch, getState) => {
    let res = await RepositoryDao.getTrendDao(page, since, languageType);
    if (res && res.result) {
        if (page === 0) {
            dispatch({
                type: REPOSITORY.TREND_REPOSITORY,
                res: res.data
            });
        } else {
            let trend = getState()['repository'].trend_repos_data_list;
            dispatch({
                type: REPOSITORY.TREND_REPOSITORY,
                res: trend.concat(res.data)
            });
        }
        callback && callback(res.data);
    } else {
        callback && callback(null);
    }
};


export default {
    getTrend,
}
