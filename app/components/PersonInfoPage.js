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
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import issueActions from "../store/actions/issue";
import Toast from "./common/ToastProxy";

/**
 * 用户信息修改页面
 */
class PersonInfoPage extends Component {

    constructor(props) {
        super(props);
        this.showEditModal = this.showEditModal.bind(this);
        this.postChanged = this.postChanged.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    showEditModal(title, text, postInfo) {
        Actions.TextInputModal({
            textConfirm: (text) => {
                postInfo(text);
            },
            titleText: title,
            bottomBar: false,
            needEditTitle: false,
            text: text,
            titleValue: ""
        })
    }

    postChanged(params) {
        Actions.LoadingModal({backExit: false});
        userActions.updateUser(params).then(() => {
            setTimeout((res) => {
                Actions.pop();
            }, 500);
        });
    }

    render() {
        let {userState} = this.props;
        let userInfo = (userState.userInfo) ? userState.userInfo : {};
        let {name, email, blog, company, location, hireable, bio} = userInfo;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ScrollView style={styles.flex}>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"info"}
                        nameText={I18n('infoName')}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        nameStyle={[styles.centered, styles.subNormalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={name ? name : "---"}
                        onClickFun={() => {
                            this.showEditModal(I18n('infoName'), name ? name : "", (text) => {
                                this.postChanged({name: text});
                            })
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"mention"}
                        nameText={I18n('infoEmail')}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        nameStyle={[styles.centered, styles.subNormalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={email ? email : "---"}
                        onClickFun={() => {
                            this.showEditModal(I18n('infoEmail'), email ? email : "", (text) => {
                                this.postChanged({email: text});
                            })
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"link"}
                        nameText={I18n('infoBlog')}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        nameStyle={[styles.centered, styles.subNormalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={blog ? blog : "---"}
                        onClickFun={() => {
                            this.showEditModal(I18n('infoBlog'), blog ? blog : "", (text) => {
                                this.postChanged({blog: text});
                            })
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"organization"}
                        nameText={I18n('infoCompany')}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        nameStyle={[styles.centered, styles.subNormalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={company ? company : "---"}
                        onClickFun={() => {
                            this.showEditModal(I18n('infoCompany'), company ? company : "", (text) => {
                                this.postChanged({company: text});
                            })
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"pin"}
                        nameText={I18n('infoLocation')}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        nameStyle={[styles.centered, styles.subNormalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={location ? location : "---"}
                        onClickFun={() => {
                            this.showEditModal(I18n('infoLocation'), location ? location : "", (text) => {
                                this.postChanged({location: text});
                            })
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"note"}
                        nameText={I18n('infoBio')}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        nameStyle={[styles.centered, styles.subNormalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={bio ? bio : "---"}
                        onClickFun={() => {
                            this.showEditModal(I18n('infoBio'), bio ? bio : "", (text) => {
                                this.postChanged({bio: text});
                            })
                        }}/>
                </ScrollView>
            </View>
        )
    }
}

export default connect(state => ({
    userState: state.user,
}), dispatch => ({
    loginAction: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch)
}))(PersonInfoPage)