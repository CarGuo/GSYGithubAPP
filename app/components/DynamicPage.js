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
import userState from '../store/reducers/user'
import loginState from '../store/reducers/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import EventItem from './widget/EventItem'


/**
 * 动态 -> 我的关注，我的仓库
 */
class DynamicPage extends Component {

    constructor(props) {
        super(props)
        this._renderRefreshControl = this._renderRefreshControl.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._renderFooter = this._renderFooter.bind(this);

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        //创建20条数据，从零开始遍历填充数据
        this.listViewData = Array(20).fill('').map((_, i) => `item #${i}`);

        //设置state
        this.state = {
            isRefresh: false,
            isLoadMore: false,
            showLoadMore:false,
            animating:false,
            dataSource: this.ds.cloneWithRows(this.listViewData)
        }
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
                          flexDirection:'row',
                          justifyContent: 'center',
                          alignItems: 'center'
                          }}>
                        <ActivityIndicator
                            color={Constant.primaryColor}
                            animating={true}
                            style={ {height: 50}}
                            size="large"/>
                        <Text style={{fontSize: 15, color:'black'}}>
                            正在加载更多···
                        </Text>
                    </View> : <View/>;

                return (footer);
            }

    /**
     * 刷新
     * */
    _refresh() {
        this.setState({
            isRefresh: true
        });
        let {userAction} = this.props;
        userAction.getEventReceived();
    }

        /**
         * 加载更多
         * */
        _loadMore() {
            this.setState({
                isLoadMore: true
            });
            setTimeout(() => {
                let loadMoreData = Array(20).fill('').map((_, i) => `load item #${i + this.listViewData.length}`);
                //注意此处，因为文本都是string的，如果string都相同，那么会导致list判断，数据都是一样的，不更新ui
                //所以，需要用listViewData的长度，
                this.listViewData = this.listViewData.concat(loadMoreData);
                this.setState({
                    dataSource: this.ds.cloneWithRows(this.listViewData)
                });
                this.setState({
                    isLoadMore: false,
                });
            }, 5000);
        }


    render() {
        let {userState} = this.props;
        let dataSource = this.ds.cloneWithRows(userState.received_events_data_list);
        console.log("************", userState);
        if (userState.received_events_current_size < 20 && this.state.showLoadMore) {
              this.setState({
                showLoadMore : false
              })
        } else if (userState.received_events_current_size > 20 && !this.state.showLoadMore)  {
            this.setState({
                showLoadMore : true
            })
        }
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ListView
                    style={{flex:1}}
                    removeClippedSubviews={false}
                    ref="list"
                    enableEmptySections
                    initialListSize={20}
                    pageSize={20}
                    onEndReachedThreshold={20}
                    refreshControl={
                        <RefreshControl
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
}), dispatch => ({
    login: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch)
}))(DynamicPage)
