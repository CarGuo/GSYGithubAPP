/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, InteractionManager
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
import {getActionAndDes} from '../utils/eventUtils'
import EventItem from './widget/EventItem'
import PullListView from './widget/PullLoadMoreListView'
import * as Config from '../config/'
import ListPage from "./widget/ListPage";
import PropTypes from 'prop-types';


/**
 * 用户列表
 */
class UserListPage extends ListPage {

    /**
     * 刷新
     * */
    _refresh() {
        switch (this.props.dataType) {
            case 'follower':
                userActions.getFollowerList(this.props.currentUser, 0).then((res) => {
                    this._refreshRes(res)
                });
                break;
            case 'followed':
                userActions.getFollowedList(this.props.currentUser, 0).then((res) => {
                    this._refreshRes(res)
                });
                break;

        }


    }

    /**
     * 加载更多
     * */
    _loadMore() {
        switch (this.props.dataType) {
            case 'follower':
                userActions.getFollowerList(this.props.currentUser, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
            case 'followed':
                userActions.getFollowedList(this.props.currentUser, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
        }
    }
}


ListPage.propTypes = {
    dataType: PropTypes.string,
    currentUser: PropTypes.string
};

export default UserListPage;
