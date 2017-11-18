/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, ListView, RefreshControl, ActivityIndicator
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import eventActions from '../store/actions/event'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import EventItem from './widget/EventItem'
import * as Config from '../config/'


/**
 * 动态 -> 我的关注，我的仓库
 */
class DynamicPage extends Component {

    constructor(props) {
        super(props);
        this._renderRefreshControl = this._renderRefreshControl.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._renderFooter = this._renderFooter.bind(this);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        //设置state
        this.state = {
            isRefresh: false,
            isRefreshing: false,
            isLoadMore: false,
            showLoadMore: false,
            showRefresh: true,
            animating: false,
            dataSource: this.ds.cloneWithRows([])
        };
        this.page = 0;
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    _renderRefreshControl() {

    }

    _renderRow() {
        return (
            <EventItem
                actionTime={1510369871000}
                actionUser={'CarGuo'}
                actionUserPic={'https://avatars0.githubusercontent.com/u/27534854?s=64&v=4'}
                actionMode={"publish"}
                actionTarget={"GSYGitHubApp"}/>
        )
    }


    /**
     * 绘制load more footer
     * */
    _renderFooter() {

        let footer = (this.state.showLoadMore) ?
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator
                    color={Constant.primaryColor}
                    animating={true}
                    style={{height: 50}}
                    size="large"/>
                <Text style={{fontSize: 15, color: 'black'}}>
                    正在加载更多···
                </Text>
            </View> : <View/>;

        return (footer);
    }

    /**
     * 刷新
     * */
    _refresh() {
        if (this.state.isRefreshing) {
            return
        }
        this.setState({
            isRefreshing: true,
            showLoadMore: false
        });
        let {eventAction} = this.props;
        eventAction.getEventReceived(0, (res) => {
            this.page = 1;
            this.setState({
                isRefreshing: false,
                showLoadMore: (res && res.length >= Config.PAGE_SIZE)
            });
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        if (this.state.isRefreshing) {
            return
        }
        let {eventState} = this.props;
        if (eventState.received_events_data_list.length === 0) {
            return
        }
        this.setState({
            isRefreshing: true,
            showRefresh: false,
        });
        let {eventAction} = this.props;
        eventAction.getEventReceived(this.page, (res) => {
            this.page++;
            this.setState({
                isRefreshing: false,
                showRefresh: true,
                showLoadMore: (res && res.length >= Config.PAGE_SIZE),
            });
        });
    }


    render() {
        let {eventState, userState} = this.props;
        let dataSource = this.ds.cloneWithRows(eventState.received_events_data_list);

        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ListView
                    style={{flex: 1}}
                    removeClippedSubviews={false}
                    ref="list"
                    enableEmptySections
                    initialListSize={30}
                    pageSize={30}
                    onEndReachedThreshold={20}
                    refreshControl={
                        <RefreshControl
                            enable={this.state.showRefresh}
                            refreshing={this.state.isRefresh}
                            onRefresh={this._refresh}
                            tintColor={Constant.primaryColor}
                            title={I18n('refreshing')}
                            colors={[Constant.primaryColor, Constant.actionColor]}/>}
                    renderRow={(rowData, sectionID, rowID, highlightRow) =>
                        this._renderRow(rowData, sectionID, rowID, highlightRow)
                    }
                    onEndReached={this._loadMore}
                    renderFooter={this._renderFooter}
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
