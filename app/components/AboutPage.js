/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Platform, StatusBar, ScrollView, Linking
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import I18n from '../style/i18n'
import CommonRowItem from "./common/CommonRowItem";
import * as Constant from "../style/constant";
import VersionNumber from 'react-native-version-number';
import issueActions from "../store/actions/issue";
import repositoryActions from "../store/actions/repository";
import Toast from './common/ToastProxy'
import {downloadUrl, hostWeb} from '../net/address'


/**
 * 关于
 */
class AboutPage extends Component {

    constructor(props) {
        super(props);
        this._createIssue = this._createIssue.bind(this);
        this.showFeedback = this.showFeedback.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    _createIssue(text) {
        let {repositoryName, userName} = this.props;
        Actions.LoadingModal({backExit: false});
        issueActions.createIssue("CarGuo", "GSYGithubApp",
            {title: "APP " + I18n("feedback"), body: text}).then((res) => {
            setTimeout(() => {
                if (res && res.result) {
                    Actions.pop();
                    Toast("Thanks For Feedback");
                } else {
                    this.showFeedback(text);
                }
            }, 500);
        })
    }

    showFeedback(text) {
        Actions.TextInputModal({
            textConfirm: this._createIssue,
            titleText: I18n('feedback'),
            needEditTitle: false,
            text: text,
            titleValue: "",
            bottomBar: true
        })
    }


    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ScrollView style={styles.flex}>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"git-commit"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('version') + ": " + VersionNumber.appVersion}
                        onClickFun={() => {
                            getNewsVersion(true, false)
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"organization"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('author')}
                        onClickFun={() => {
                            Actions.PersonPage({currentUser: "CarGuo"})
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"link"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('projectUrl')}
                        onClickFun={() => {
                            Actions.RepositoryDetail({
                                repositoryName: "GSYGithubApp", ownerName: "CarGuo"
                                , title: "CarGuo/GSYGithubApp"
                            });
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"question"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('feedback')}
                        onClickFun={() => {
                            this.showFeedback("")
                        }}/>
                </ScrollView>
            </View>
        )
    }
}


export const getNewsVersion = (showTip, onlyCheck = true) => {
    //ios不检查更新
    if (Platform.OS === "ios" && onlyCheck) {
        return
    }
    repositoryActions.getRepositoryRelease("CarGuo", 'GSYGithubApp', 1, false).then((res) => {
        if (res && res.result) {
            //github只能有release的versionName，没有code，囧
            let versionName = res.data[0].name;
            if (__DEV__) {
                console.log("service versionName ", versionName)
            }
            if (versionName) {
                let versionNameNum = parseFloat(versionName);
                let currentNum = parseFloat(VersionNumber.appVersion);
                let newsHad = versionNameNum > currentNum;
                if (__DEV__) {
                    console.log("service versionNameNum ", versionNameNum);
                    console.log("local currentNum ", currentNum);
                    console.log("version update newsHad ", newsHad);
                }
                if (newsHad) {
                    Actions.ConfirmModal({
                        titleText: I18n('update'),
                        text: I18n('update') + ": " + res.data[0].name + "\n" + res.data[0].body,
                        textConfirm: () => {
                            if (Platform.OS === "ios") {
                                Linking.openURL(hostWeb + "CarGuo/GSYGithubApp/releases")
                            } else {
                                Linking.openURL(downloadUrl)
                            }
                        }
                    });
                } else {
                    if (showTip)
                        Toast(I18n("newestVersion"));
                }
            }
        }
    })
}

export default AboutPage
