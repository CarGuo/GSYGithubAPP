/**
 * Created by guoshuyu on 2017/11/17.
 */


import Api from '../net'
import Address from '../net/address'
import realm from './db'

/**
 *
 */
const getEventReceivedDao = async (page = 0, userName, local) => {

    if (local) {
        let allData = realm.objects('ReceivedEvent');
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                result: true
            };
        } else {
            return {
                data: [],
                result: false
            };
        }
    }

    let url = Address.getEventReceived(userName) + Address.getPageParams("?", page);
    let res = await Api.netFetch(url);
    if (res && res.result && res.data.length > 0 && page <= 1) {
        realm.write(() => {
            let allEvent = realm.objects('ReceivedEvent');
            realm.delete(allEvent);
            res.data.forEach((item) => {
                realm.create('ReceivedEvent', {
                    data: JSON.stringify(item)
                });
            })
        });
    }
    return {
        data: res.data,
        result: res.result
    };
};

const getEventFromNet = async (page = 0, userName) => {
    let url = Address.getEvent(userName) + Address.getPageParams("?", page);
    let res = await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

const getRepositoryEventDao = async (page = 0, userName, repository) => {
    let url = Address.getReposEvent(userName, repository) + Address.getPageParams("?", page);
    let res = await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };

};

const getEventReceivedFromDb = async (page = 0, userName) => {

};

export default {
    getEventReceivedDao,
    getRepositoryEventDao,
    getEventFromNet
}