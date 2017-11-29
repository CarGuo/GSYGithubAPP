/**
 * Created by guoshuyu on 2017/11/17.
 */


import Api from '../net'
import Address from '../net/address'

const getEventReceivedFromNet = async (page = 0, userName) => {
    let url = Address.getEventReceived(userName) + Address.getPageParams("?", page);
    let res = await Api.netFetch(url);
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
    getEventReceivedFromNet,
    getEventReceivedFromDb,
    getRepositoryEventDao,
    getEventFromNet
}