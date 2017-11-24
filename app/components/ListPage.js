/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, InteractionManager, TouchableOpacity, Keyboard
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style/index"
import * as Constant from "../style/constant"
import userActions from '../store/actions/user'
import repositoryActions from '../store/actions/repository'
import I18n from '../style/i18n'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import UserItem from './widget/UserItem'
import CommonRowItem from './widget/CommonRowItem'
import CustomSearchButton from './widget/CustomSearchButton'
import PullListView from './widget/PullLoadMoreListView'
import RepositoryItem from './widget/RepositoryItem'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config/index'
import PropTypes from 'prop-types';


/**
 * 列表
 */
class ListPage extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.page = 2;
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refs.pullList.showRefreshState();
            this._refresh();
        })
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {

    }


    _renderRow(rowData, sectionID, rowID, highlightRow) {
        switch (this.props.showType) {
            case 'repository':
                return ( <RepositoryItem
                    ownerName={rowData.owner.login}
                    ownerPic={rowData.owner.avatar_url}
                    repositoryName={rowData.name}
                    repositoryStar={rowData.watchers_count + ""}
                    repositoryFork={rowData.forks_count + ""}
                    repositoryWatch={rowData.open_issues + ""}
                    repositoryType={rowData.language}
                    repositoryDes={(rowData.description) ? rowData.description : '---'}
                />);
                break;
            case 'user':
                return (<UserItem
                    location={rowData.location}
                    actionUser={rowData.login}
                    actionUserPic={rowData.avatar_url}
                    des={rowData.bio}/>);
                break;
        }
    }



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
            case 'user_repos':
                repositoryActions.getUserRepository(this.props.currentUser, 0).then((res) => {
                    this._refreshRes(res)
                });
                break;
            case 'user_star':
                repositoryActions.getStarRepository(this.props.currentUser, 0).then((res) => {
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
            case 'user_repos':
                repositoryActions.getUserRepository(this.props.currentUser, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
            case 'user_star':
                repositoryActions.getStarRepository(this.props.currentUser, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
        }
    }


    /**
     * 刷新
     * */
    _refreshRes(res) {
        let size = 0;
        if (res && res.result) {
            this.page = 2;
            this.setState({
                dataSource: res.data
            });
            size = res.data.length;
        }
        setTimeout(() => {
            if (this.refs.pullList) {
                this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE));
            }
        }, 500);

    }

    /**
     * 加载更多
     * */
    _loadMoreRes(res) {
        let size = 0;
        if (res && res.result) {
            this.page++;
            let dataList = this.state.dataSource.concat(res.data);
            this.setState({
                dataSource: dataList
            });
            size = res.data.length;
        }
        setTimeout(() => {
            if (this.refs.pullList) {
                this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE));
            }
        }, 500);
    }

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    enableRefresh={false}
                    renderRow={(rowData, sectionID, rowID, highlightRow) =>
                        this._renderRow(rowData, sectionID, rowID, highlightRow)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={this.state.dataSource}
                />
            </View>
        )
    }
}

ListPage.propTypes = {
    showType: PropTypes.string,
    dataType: PropTypes.string,
    currentUser: PropTypes.string
};

export default ListPage