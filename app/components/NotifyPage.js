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
import WebComponent from './widget/WebComponent'
import CommonBottomBar from './widget/CommonBottomBar'
import IssueListPage from './IssueListPage'
import RepositoryDetailActivity from './RepositoryDetailActivity'
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';
import ListPage from "./ListPage";

/**
 * 详情
 */
class NotifyPage extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this._refresh = this._refresh.bind(this);
        this._asRead = this._asRead.bind(this);
        this.state = {
            index: 0,
            routes: [
                {key: '1', title: I18n('notifyUnread')},
                {key: '2', title: I18n('notifyParticipating')},
                {key: '3', title: I18n('notifyAll')},
            ],
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.props.backNotifyCall && this.props.backNotifyCall()
    }

    _refresh() {
        if (this.refs.unReadList)
            this.refs.unReadList._refresh();
        if (this.refs.partList)
            this.refs.partList._refresh();
        if (this.refs.allList)
            this.refs.allList._refresh();
    }

    _handleIndexChange = index => this.setState({index});


    _asRead(id) {
        userActions.setNotificationAsRead(id).then(() => {
            this._refresh();
        })
    }

    _renderHeader = props =>
        <TabBar {...props}
                style={{backgroundColor: Constant.primaryColor}}
                labelStyle={{color: Constant.white}}
                indicatorStyle={{backgroundColor: Constant.miWhite}}
        />;

    _renderScene = ({route}) => {
        switch (route.key) {
            case '1':
                return (
                    <ListPage
                        refs={"unReadList"}
                        dataType={'notify'}
                        showType={'notify'}
                        onItemClickEx={this._asRead}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />
                );
            case '2':
                return (
                    <ListPage
                        refs={"partList"}
                        dataType={'notify'}
                        showType={'notify'}
                        onItemClickEx={this._asRead}
                        participating={true}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />
                );
            case '3':
                return (
                    <ListPage
                        refs={"allList"}
                        dataType={'notify'}
                        showType={'notify'}
                        onItemClickEx={this._asRead}
                        all={true}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />
                );
            default:
                return null;
        }
    };


    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <TabViewAnimated
                    style={{
                        flex: 1,
                    }}
                    lazy={true}
                    swipeEnabled={false}
                    navigationState={this.state}
                    renderScene={this._renderScene.bind(this)}
                    renderHeader={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={{
                        height: 0,
                        width: Dimensions.get('window').width,
                    }}
                />
            </View>
        )
    }
}

NotifyPage.defaultProps = {};


export default NotifyPage