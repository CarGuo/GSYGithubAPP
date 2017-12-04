import {Actions} from "react-native-router-flux";

//网络错误
export const NETWORK_ERROR = 1;
//网络超时
export const NETWORK_TIMEOUT = 2;
//网络返回数据格式化一次
export const NETWORK_JSON_EXCEPTION = 3;


export const SUCCESS = 200;


export default function (code) {

    switch (code) {
        case 401:
            //授权逻辑
            if (Actions.currentScene !== 'LoginPage') {
                Actions.reset("LoginPage");
            }
            return "未授权或授权失败";//401 Unauthorized
        case 403:
            return "403权限错误";
        case 404:
            return "404错误";
        case 500:
            return "500错误";
        default:
            return "其他异常"
    }

}