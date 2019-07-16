import {Actions} from "react-native-router-flux";
import I18n from '../style/i18n'
import Toast from '../components/common/ToastProxy'

//网络错误
export const NETWORK_ERROR = 1;
//网络超时
export const NETWORK_TIMEOUT = 2;
//网络返回数据格式化一次
export const NETWORK_JSON_EXCEPTION = 3;


export const SUCCESS = 200;


export default function (code, statusText) {
    switch (code) {
        case 401:
            //授权逻辑
            if (Actions.currentScene !== 'LoginPage') {
                Actions.reset("LoginPage");
            }
            return "未授权或授权失败";//401 Unauthorized
        case 403:
            Toast(I18n('noPower'));
            return "403权限错误";
        case 404:
            //Toast(I18n('notFound'));
            return "404错误";
        case 410:
            Toast(I18n('gone410'));
            return "410错误";
        case NETWORK_TIMEOUT:
            //超时
            Toast(I18n('netTimeout'));
            return I18n('netTimeout');
        default:
            if (statusText) {
                Toast(statusText);
            } else {
                Toast(I18n('errorUnKnow'));
            }
            return "其他异常"
    }

}