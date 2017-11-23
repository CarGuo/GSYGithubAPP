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
        setting: 'setting',
        daysAgo: 'daysAgo',
        hoursAgo: 'hoursAgo',
        minutesAgo: 'minutesAgo',
        justNow: 'justNow',
        UserName: 'UserName',
        Password: 'Password',
        Login: 'Login',
        LoginOut: 'LoginOut',
        LoginNameTip: 'username can\'t not be empty',
        LoginPWTip: 'password can\'t not be empty',
        LoginFailTip: 'login fail',
        refreshing: 'refreshing...',
        loading: 'loading...',
        loadMoreing: 'loading...',
        loadMoreEnd: 'no more',
        doublePressExit: 'Press again to Exit',
        userInfoNoting: 'nothing',
        staredText: 'stared',
        FollowersText: 'follower',
        FollowedText: 'followed',
        repositoryText: 'repository',
        personDynamic: 'Activity',
        trendDay: 'Day',
        trendWeek: 'Week',
        trendMonth: 'Month',
        trendAll: 'All',
        search: 'search',
        best_match: 'Best match',
        stars: 'stars',
        forks: 'forks',
        updated: 'updated',
        filerType: 'Type',
        filterSort: 'Sort',
        filterLanguage: 'Language',
        desc: 'Desc',
        asc: 'Asc',
        Java:'Java',
        Kotlin:'Kotlin',
        Objective_C:'Objective-C',
        Swift:'Swift',
        JavaScript:'JavaScript',
        PHP:'PHP',
        Go:'Go',
        C__:'C++',
        C:'C',
        HTML:'HTML',
        CSS:'CSS',
        unknown:'unknown',
    },
    'zh-CN': {
        appName: 'GSYGitHubApp',
        netError: '网络错误',
        netTimeout: '网络超时',
        tabRecommended: '推荐',
        tabDynamic: '动态',
        tabMy: '我的',
        setting: '设置',
        daysAgo: '天前',
        hoursAgo: '小时前',
        minutesAgo: '分钟前',
        justNow: '刚刚',
        UserName: '用户名',
        Password: '密码',
        Login: '登陆',
        LoginOut: '退出登陆',
        LoginNameTip: '用户名不能为空',
        LoginPWTip: '密码不能为空',
        LoginFailTip: '登陆失败',
        refreshing: '刷新中...',
        loadMoreing: '正在加载更多···',
        loadMoreEnd: '加载完了哟',
        loading: '加载中...',
        doublePressExit: '双击退出',
        userInfoNoting: 'Ta什么都没留下',
        staredText: '星标',
        FollowersText: '粉丝',
        FollowedText: '关注',
        repositoryText: '仓库',
        personDynamic: '个人动态',
        trendDay: '今日',
        trendWeek: '本周',
        trendMonth: '本月',
        trendAll: '全部',
        search: '搜索',
        best_match: '最匹配',
        stars: 'star',
        forks: 'forks',
        updated: '更新',
        desc: '倒叙',
        asc: '正序',
        filerType: '类型',
        filterSort: '排序',
        filterLanguage: '语言',
        Java:'Java',
        Kotlin:'Kotlin',
        Objective_C:'Objective-C',
        Swift:'Swift',
        JavaScript:'JavaScript',
        PHP:'PHP',
        Go:'Go',
        C__:'C++',
        C:'C',
        HTML:'HTML',
        CSS:'CSS',
        unknown:'unknown',
    }
};

export const changeLocale = function (multilingual) {
    if (multilingual === 'local' || !multilingual) {
        I18n.locale = (RNI18n && RNI18n.locale) ? RNI18n.locale.replace(/_/, '-') : ''
    } else {
        I18n.locale = multilingual
    }

    // for ios
    if (I18n.locale.indexOf('zh-Hans') !== -1) {
        I18n.locale = 'zh-CN'
    } else if (I18n.locale.indexOf('zh-Hant') !== -1 || I18n.locale === 'zh-HK' || I18n.locale === 'zh-MO') {
        I18n.locale = 'zh-CN'
    }
};

export default function (name, option1, option2) {
    return I18n.t(name, option1, option2)
}