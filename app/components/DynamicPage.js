/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, AppState, StatusBar, InteractionManager
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import eventActions from '../store/actions/event'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getActionAndDes, ActionUtils} from '../utils/eventUtils'
import EventItem from './widget/EventItem'
import PullListView from './widget/PullLoadMoreListView'
import * as Config from '../config'
import {getNewsVersion} from './AboutPage'


/**
 * 动态 -> 我的关注，我的仓库
 */
class DynamicPage extends Component {

    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this.startRefresh = this.startRefresh.bind(this);
        this.page = 1;
        this.appState = 'active';
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.startRefresh();
            getNewsVersion();
        });
        AppState.addEventListener('change', this._handleAppStateChange);

        /*setTimeout(() => {
            if (__DEV__) {
                Actions.VersionPage({
                    ownerName: "CarGuo",
                    repositoryName:"GSYGithubApp",
                    title: "CarGuo/GSYGithubApp"
                })
            }
        }, 1000)*/

    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    startRefresh() {
        if (this.refs.pullList)
            this.refs.pullList.showRefreshState();
        this._refresh();
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
            if (this.refs.pullList)
                this.refs.pullList.scrollToTop();
            this.startRefresh();
        }
        this.appState = nextAppState;
    };

    _renderRow(rowData) {
        let res = getActionAndDes(rowData);
        return (
            <EventItem
                actionTime={rowData.created_at}
                actionUser={rowData.actor.display_login}
                actionUserPic={rowData.actor.avatar_url}
                des={res.des}
                onPressItem={() => {
                    ActionUtils(rowData)
                }}
                actionTarget={res.actionStr}/>
        )
    }

    /**
     * 刷新
     * */
    _refresh() {
        let {eventAction} = this.props;
        eventAction.getEventReceived(0, (res) => {
            this.page = 2;
            setTimeout(() => {
                if (this.refs.pullList) {
                    this.refs.pullList.refreshComplete((res && res.length >= Config.PAGE_SIZE));
                }
            }, 500);
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        let {eventAction} = this.props;
        eventAction.getEventReceived(this.page, (res) => {
            this.page++;
            setTimeout(() => {
                if (this.refs.pullList) {
                    this.refs.pullList.loadMoreComplete((res && res.length >= Config.PAGE_SIZE));
                }
            }, 300);
        });
    }


    render() {
        let {eventState, userState} = this.props;
        let dataSource = (eventState.received_events_data_list);
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    renderRow={(rowData, index) =>
                        this._renderRow(rowData)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={dataSource}
                />
            </View>
        )
    }
}

export default connect(state => ({
    userState: state.user,
    loginState: state.login,
    eventState: state.event,
}), dispatch => ({
    loginAction: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch),
    eventAction: bindActionCreators(eventActions, dispatch)
}))(DynamicPage)
