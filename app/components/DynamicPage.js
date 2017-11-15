/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, ListView, RefreshControl
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
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

        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        //创建20条数据，从零开始遍历填充数据
        this.listViewData = Array(20).fill('').map((_, i) => `item #${i}`);

        //设置state
        this.state = {
            isRefresh: false,
            isLoadMore: false,
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
     * 刷新
     * */
    _refresh() {
        this.setState({
            isRefresh: true
        });

        let {userAction} = this.props;
        userAction.getEventReceived();
        /*setTimeout(() => {
         this.listViewData = Array(20).fill('').map((_, i) => `refresh item #${i}`);
         this.setState({
         dataSource: this.ds.cloneWithRows(this.listViewData)
         });
         this.setState({
         isRefresh: false
         });
         }, 2500);*/
    }

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ListView
                    style={{flex:1}}
                    removeClippedSubviews={false}
                    ref="list"
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
                    dataSource={this.state.dataSource}
                />
            </View>
        )
    }
}

export default connect(state => ({
    state
}), dispatch => ({
    login: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch)
}))(DynamicPage)