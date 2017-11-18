/**
 * Created by guoshuyu on 2017/11/7.
 */
import {NativeModules} from 'react-native';
import I18n from 'react-native-i18n'

const {RNI18n} = NativeModules;

I18n.fallbacks = true;

I18n.defaultLocale = "zh-CN";


I18n.translations = {
    'en': {
        appName: 'GSYGitHubApp',
        netError: 'network error',
        netTimeout: 'network timeout',
        tabRecommended: 'Recommend',
        tabDynamic: 'Dynamic',
        tabMy: 'My',
        daysAgo: 'daysAgo',
        hoursAgo: 'hoursAgo',
        minutesAgo: 'minutesAgo',
        justNow: 'justNow',
        UserName: 'UserName',
        Password: 'Password',
        Login: 'Login',
        LoginNameTip: 'username can\'t not be empty',
        LoginPWTip: 'password can\'t not be empty',
        LoginFailTip: 'login fail',
        refreshing: 'refreshing...',
        loading: 'loading...',
        exitTip: 'loading...',
        doublePressExit: 'Press again to Exit',
    },
    'zh-CN': {
        appName: 'GSYGitHubApp',
        netError: '网络错误',
        netTimeout: '网络超时',
        tabRecommended: '推荐',
        tabDynamic: '动态',
        tabMy: '我的',
        daysAgo: '天前',
        hoursAgo: '小时前',
        minutesAgo: '分钟前',
        justNow: '刚刚',
        UserName: '用户名',
        Password: '密码',
        Login: '登陆',
        LoginNameTip: '用户名不能为空',
        LoginPWTip: '密码不能为空',
        LoginFailTip: '登陆失败',
        refreshing: '刷新中...',
        loading: '加载中...',
        doublePressExit: '双击退出',
    }
};

export const changeLocale = function (multilingual) {
    if (multilingual == 'local' || !multilingual) {
        I18n.locale = (RNI18n && RNI18n.locale) ? RNI18n.locale.replace(/_/, '-') : ''
    } else {
        I18n.locale = multilingual
    }

    // for ios
    if (I18n.locale.indexOf('zh-Hans') != -1) {
        I18n.locale = 'zh-CN'
    } else if (I18n.locale.indexOf('zh-Hant') != -1 || I18n.locale == 'zh-HK' || I18n.locale == 'zh-MO') {
        I18n.locale = 'zh-CN'
    }
};

export default function (name, option1, option2) {
    return I18n.t(name, option1, option2)
}