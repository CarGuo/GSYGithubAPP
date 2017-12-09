/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import I18n from '../style/i18n'
import CommonRowItem from "./common/CommonRowItem";
import * as Constant from "../style/constant";
import VersionNumber from 'react-native-version-number';
import issueActions from "../store/actions/issue";
import Toast from './common/ToastProxy'


/**
 * 关于
 */
class AboutPage extends Component {

    constructor(props) {
        super(props);
        this._createIssue = this._createIssue.bind(this)
        this.showFeedback = this.showFeedback.bind(this)
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
            titleValue: ""
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
                        itemText={I18n('feedback')}
                        onClickFun={() => {
                            this.showFeedback("")
                        }}/>
                </ScrollView>
            </View>
        )
    }
}

export default AboutPage
