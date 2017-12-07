import * as Constant from "../style/constant"
import {StyleSheet, Linking, Clipboard, Platform} from "react-native";
import {Actions} from 'react-native-router-flux';
import I18n from '../style/i18n'
import Toast from '../components/widget/ToastProxy'
import {FSModule} from '../net'


export const RepositoryDetailRightBtnPress = (props) => {
    Actions.OptionModal({dataList: RepositoryMore(props)});
};


export const RepositoryMore = (props) => {
    return [{
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
        itemName: I18n("download"),
        itemValue: 'download',
        itemClick: () => {
            if (Platform.OS === "ios") {
                Toast(I18n("iosNotSupportDown"));
            } else if (props.titleData && props.titleData.downloads_url) {
                console.log("FFF", props.titleData.downloads_url)
                FSModule.download({
                    url: props.titleData.downloads_url,
                    description: (I18n("downloadDescription") + props.ownerName + "/" + props.repositoryName)
                })
            }
        }, itemStyle: {}
    },]
};