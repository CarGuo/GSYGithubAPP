/**
 * Created by guoshuyu on 2017/11/8.
 */


let host = "https://api.github.com/";

export default AddressLocal = {
    sreach: (q, sort, order) => {
        if (!sort) {
            sort = "best%20match"
        }
        if (!order) {
            order = "desc"
        }
        return `${host}search/repositories?q=${q}&sort=${sort}&order=${order}`
    },
};