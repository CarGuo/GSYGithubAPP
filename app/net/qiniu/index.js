import Rpc from "./rpc"
import Auth from "./auth"
import Conf from './conf.js';
import moment from 'moment';
import {ACCESS_KEY, SECRET_KEY, QN_HOST, SCOPE} from "../../config/ignoreConfig"

Conf.ACCESS_KEY = ACCESS_KEY;
Conf.SECRET_KEY = SECRET_KEY;

/**
 * 上传图片到七牛
 */
export const uploadQiNiu = async (base64) => {
    let putPolicy = new Auth.PutPolicy2(
        {scope: SCOPE}
    );
    let uptoken = putPolicy.token();
    let formInput = {
        key: moment().format('YYYY-MM-DD') + "/" + moment().toDate().getTime() + ".jpg",
    };
    let res = await Rpc.uploadBase64(base64, uptoken, formInput.key);
    if (res.status === 200) {
        return {
            result: true,
            data: QN_HOST + formInput.key
        }
    } else {
        return {
            result: false,
            data: ""
        }
    }

};