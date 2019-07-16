/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, Dimensions, StyleSheet
} from 'react-native';
import {Actions, Tabs} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import userActions from '../store/actions/user'
import ListPage from "./ListPage";
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view-fix-guo';
import {launchUrl} from "../utils/htmlUtils";

/**
 * 通知页面
 */
class NotifyPage extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this._refresh = this._refresh.bind(this);
        this._asRead = this._asRead.bind(this);
        this.index = 0;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.props.backNotifyCall && this.props.backNotifyCall()
    }

    componentWillReceiveProps(newProps) {
        if (newProps && newProps.type === "allRead") {
            newProps.type = "";
            this._refresh();
        }
    }

    _refresh() {
        if (this.unReadList)
            this.unReadList._refresh();
        if (this.partList)
            this.partList._refresh();
        if (this.allList)
            this.allList._refresh();
    }

    _handleIndexChange = index => this.setState({index});


    _asRead(id) {
        userActions.setNotificationAsRead(id).then(() => {
            this._refresh();
        })
    }


    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ScrollableTabView
                    onChangeTab={(params) => {
                        this.index = params.i;
                    }}
                    tabBarUnderlineStyle={{
                        backgroundColor: Constant.white,
                        height: 3
                    }}
                    renderTabBar={(props) => {
                        return <DefaultTabBar {...props} style={{paddingTop: 5}}/>;
                    }}
                    tabBarBackgroundColor={Constant.primaryColor}
                    tabBarActiveTextColor={Constant.white}
                    tabBarInactiveTextColor={Constant.subTextColor}
                    tabBarTextStyle={{fontSize: 16}}>
                    <ListPage
                        tabLabel={I18n('notifyUnread')}
                        ref={(ref) => {
                            this.unReadList = ref;
                        }}
                        dataType={'notify'}
                        showType={'notify'}
                        onItemClickEx={this._asRead}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />

                    <ListPage
                        tabLabel={I18n('notifyParticipating')}
                        ref={(ref) => {
                            this.unReadList = ref;
                        }}
                        dataType={'notify'}
                        showType={'notify'}
                        onItemClickEx={this._asRead}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />

                    <ListPage
                        tabLabel={I18n('notifyAll')}
                        ref={(ref) => {
                            this.allList = ref;
                        }}
                        dataType={'notify'}
                        showType={'notify'}
                        onItemClickEx={this._asRead}
                        all={true}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />
                </ScrollableTabView>
            </View>
        )
    }
}

NotifyPage.defaultProps = {};


export default NotifyPage