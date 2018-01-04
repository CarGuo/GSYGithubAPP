import * as Constant from "../style/constant"
import {StyleSheet, Linking, Clipboard, Platform, Share, AsyncStorage} from "react-native";
import {Actions} from 'react-native-router-flux';
import I18n from '../style/i18n'
import Toast from '../components/common/ToastProxy'
import {FSModule} from '../net'
import {changeLocale} from '../style/i18n'


export const RepositoryDetailRightBtnPress = (props) => {
    Actions.OptionModal({dataList: RepositoryMore(props)});
};


export const RepositoryMore = (props) => {
    let normalAction = [{
        itemName: I18n("reposRelease"),
        itemValue: 'reposRelease',
        itemClick: () => {
            Actions.VersionPage({
                ownerName: props.ownerName,
                repositoryName: props.repositoryName,
                title: props.ownerName + "/" + props.repositoryName
            })
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {
        itemName: I18n("browserOpen"),
        itemValue: 'browserOpen',
        itemClick: () => {
            if (props.titleData && props.titleData.html_url)
                Linking.openURL(props.titleData.html_url)
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {
        itemName: I18n("copy"),
        itemValue: 'copy',
        itemClick: () => {
            if (props.titleData && props.titleData.html_url) {
                Clipboard.setString(props.titleData.html_url);
                Toast(I18n("hadCopy"));
            }
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {
        itemName: I18n("copyClone"),
        itemValue: 'copyClone',
        itemClick: () => {
            if (props.titleData && props.titleData.clone_url) {
                Clipboard.setString(props.titleData.clone_url);
                Toast(I18n("hadCopy"));
            }
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {
        itemName: I18n("download"),
        itemValue: 'download',
        itemClick: () => {
            if (Platform.OS === "ios") {
                Toast(I18n("iosNotSupportDown"));
            } else if (props.titleData && props.titleData.downloads_url) {
                FSModule.download({
                    url: props.titleData.downloads_url,
                    description: (I18n("downloadDescription") + props.ownerName + "/" + props.repositoryName)
                })
            }
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {

        itemName: I18n("share"),
        itemValue: 'share',
        itemClick: () => {
            if (Platform.OS === "ios") {
                Share.share({
                    title: I18n("appName"),
                    url: props.titleData.html_url,
                    message: props.titleData.html_url
                }).then(() => {

                }).catch(() => {

                })
            } else {
                Share.share({title: I18n("appName"), message: props.titleData.html_url}).then(() => {

                }).catch(() => {

                })
            }
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}

    }];
    if (props.titleData && props.titleData.has_wiki) {
        let wiki = {
            itemName: "wiki",
            itemValue: 'wiki',
            itemClick: () => {
                if (props.titleData && props.titleData.html_url)
                    Linking.openURL(props.titleData.html_url + "/wiki")
            }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
        };
        normalAction.push(wiki)
    }
    return normalAction;
};

export const CommonMoreRightBtnPress = (props) => {
    Actions.OptionModal({dataList: CommonMore(props)});
};


export const CommonMore = (props) => {
    return [, {
        itemName: I18n("browserOpen"),
        itemValue: 'browserOpen',
        itemClick: () => {
            if (props.titleData && props.titleData.html_url)
                Linking.openURL(props.titleData.html_url)
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {
        itemName: I18n("copy"),
        itemValue: 'copy',
        itemClick: () => {
            if (props.titleData && props.titleData.html_url) {
                Clipboard.setString(props.titleData.html_url);
                Toast(I18n("hadCopy"));
            }
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {

        itemName: I18n("share"),
        itemValue: 'share',
        itemClick: () => {
            if (Platform.OS === "ios") {
                Share.share({
                    title: I18n("appName"),
                    url: props.titleData.html_url,
                    message: props.titleData.html_url
                }).then(() => {

                }).catch(() => {

                })
            } else {
                Share.share({title: I18n("appName"), message: props.titleData.html_url}).then(() => {

                }).catch(() => {

                })
            }
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}

    }]
};

export const LanguageSelect = (callback) => {
    return [{
        itemName: I18n("systemLanguage"),
        itemValue: 'systemLanguage',
        itemClick: () => {
            AsyncStorage.removeItem(Constant.LANGUAGE_SELECT);
            AsyncStorage.removeItem(Constant.LANGUAGE_SELECT_NAME);
            changeLocale();
            Actions.refresh();
            callback && callback()
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {
        itemName: I18n("zhLanguage"),
        itemValue: 'zhLanguage',
        itemClick: () => {
            selectLanguage("zh-CN", 'zhLanguage');
            callback && callback()
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}
    }, {

        itemName: I18n("enLanguage"),
        itemValue: 'enLanguage',
        itemClick: () => {
            selectLanguage("en", 'enLanguage');
            callback && callback()
        }, itemStyle: {borderBottomWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,}

    }]
};


export const getLanguageCurrent = async () => {
    let language = await  AsyncStorage.getItem(Constant.LANGUAGE_SELECT);
    let languageName = await  AsyncStorage.getItem(Constant.LANGUAGE_SELECT_NAME);
    return {
        language: language,
        languageName: languageName,
    };
};

const selectLanguage = (lang, langName) => {
    AsyncStorage.setItem(Constant.LANGUAGE_SELECT, lang);
    AsyncStorage.setItem(Constant.LANGUAGE_SELECT_NAME, langName);
    changeLocale(lang);
    Actions.refresh();
};


const refreshHandler = new Map();
export const getRefreshHandler = () => {
    return refreshHandler;
};