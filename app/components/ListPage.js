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
import IssueItem from './widget/IssueItem'
import ReleaseItem from './widget/ReleaseItem'
import CustomSearchButton from './widget/CustomSearchButton'
import PullListView from './widget/PullLoadMoreListView'
import RepositoryItem from './widget/RepositoryItem'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config/index'
import PropTypes from 'prop-types';
import {getFullName} from '../utils/htmlUtils'


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
            case 'issue':
                let fullName = getFullName(rowData.repository_url) + "--";
                return (
                    <IssueItem
                        actionTime={rowData.created_at}
                        actionUser={rowData.user.login}
                        actionUserPic={rowData.user.avatar_url}
                        issueComment={fullName + rowData.title}
                        commentCount={rowData.comments + ""}
                        state={rowData.state}
                        issueTag={"#" + rowData.number}
                        onPressItem={() => {
                            Actions.IssueDetail({
                                issue: rowData, title: fullName,
                                repositoryName: this.props.repositoryName,
                                userName: this.props.userName
                            })
                        }}/>
                );
                break;
            case 'release':
                return (
                    <ReleaseItem
                        actionTime={rowData.published_at}
                        actionTitle={rowData.name}
                        actionTarget={rowData.body}
                        actionTargetHtml={rowData.body_html}
                        onPressItem={() => {

                        }}
                    />
                );
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
            case 'repo_star':
                repositoryActions.getRepositoryStar(this.props.currentUser, this.props.currentRepository, 0).then((res) => {
                    this._refreshRes(res)
                });
                break;
            case 'repo_watcher':
                repositoryActions.getRepositoryWatcher(this.props.currentUser, this.props.currentRepository, 0).then((res) => {
                    this._refreshRes(res)
                });
                break;
            case 'repo_fork':
                repositoryActions.getRepositoryForks(this.props.currentUser, this.props.currentRepository, 0).then((res) => {
                    this._refreshRes(res)
                });
                break;
            case 'repo_release':
                repositoryActions.getRepositoryRelease(this.props.currentUser, this.props.currentRepository, 0).then((res) => {
                    this._refreshRes(res)
                });
                break;
            case 'repo_tag':
                repositoryActions.getRepositoryTag(this.props.currentUser, this.props.currentRepository, 0).then((res) => {
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
            case 'repo_star':
                repositoryActions.getRepositoryStar(this.props.currentUser, this.props.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
            case 'repo_watcher':
                repositoryActions.getRepositoryWatcher(this.props.currentUser, this.props.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
            case 'repo_fork':
                repositoryActions.getRepositoryForks(this.props.currentUser, this.props.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
            case 'repo_release':
                repositoryActions.getRepositoryRelease(this.props.currentUser, this.props.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
                break;
            case 'repo_tag':
                repositoryActions.getRepositoryTag(this.props.currentUser, this.props.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res)
                });
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
    currentUser: PropTypes.string,
    currentRepository: PropTypes.string
};

export default ListPage