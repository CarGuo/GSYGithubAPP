/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Linking, StatusBar, InteractionManager, TouchableOpacity, Keyboard,
} from 'react-native';
import {Actions} from '../navigation/Actions';
import styles from '../style/index';
import * as Constant from '../style/constant';
import userActions from '../store/actions/user';
import repositoryActions from '../store/actions/repository';
import I18n from '../style/i18n';
import UserItem from './widget/UserItem';
import IssueItem from './widget/IssueItem';
import EventItem from './widget/EventItem';
import ReleaseItem from './widget/ReleaseItem';
import PullListView from './widget/PullLoadMoreListView';
import RepositoryItem from './widget/RepositoryItem';
import * as Config from '../config/index';
import PropTypes from 'prop-types';
import {getFullName} from '../utils/htmlUtils';
import {generateHtml} from '../utils/htmlUtils';
import {DeviceEventEmitter} from 'react-native';


/**
 * 多种数据列表
 */
class ListPage extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._doRefresh = this._doRefresh.bind(this);
        this.page = 2;
        this.pullListRef = React.createRef();
        if(this.props.route.params.filterSelect != null) {
         this.filterSelect = this.props.route.params.filterSelect;
        }
        this.state = {
            dataSource: [],
        };
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener(
            `${this.props.route.params.dataType}+${this.props.route.params.showType}`,
            (params) => {
                if (this.props.route.params.filterSelect !== params.filterSelect) {
                    this.filterSelect = params.filterSelect;
                    this._doRefresh();
                }
            });
        InteractionManager.runAfterInteractions(() => {
            if (this.pullListRef.current) {
                this.pullListRef.current.showRefreshState();
            }
            this._refresh();
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    _doRefresh() {
        if (this.pullListRef.current) {
            this.pullListRef.current.showRefreshState();
        }
        this._refresh();
    }


    _renderRow(rowData) {
        switch (this.props.route.params.showType) {
            case 'repository':
                if (this.props.route.params.dataType === 'history') {
                    rowData = rowData.data;
                }
                return (<RepositoryItem
                    ownerName={rowData.owner.login}
                    ownerPic={rowData.owner.avatar_url}
                    repositoryName={rowData.name}
                    repositoryStar={rowData.watchers_count + ''}
                    repositoryFork={rowData.forks_count + ''}
                    repositoryWatch={rowData.open_issues + ''}
                    repositoryType={rowData.language}
                    repositoryDes={(rowData.description) ? rowData.description : '---'}
                />);
            case 'user':
                return (<UserItem
                    location={rowData.location}
                    actionUser={rowData.login}
                    actionUserPic={rowData.avatar_url}
                    des={rowData.bio}/>);
            case 'org':
                return (<UserItem
                    location={''}
                    actionUser={rowData.login}
                    actionUserPic={rowData.avatar_url}
                    des={rowData.description}/>);
            case 'issue':
                let fullName = getFullName(rowData.repository_url) + '--';
                return (
                    <IssueItem
                        actionTime={rowData.created_at}
                        actionUser={rowData.user.login}
                        actionUserPic={rowData.user.avatar_url}
                        issueComment={fullName + rowData.title}
                        commentCount={rowData.comments + ''}
                        state={rowData.state}
                        issueTag={'#' + rowData.number}
                        onPressItem={() => {
                            Actions.IssueDetail({
                                issue: rowData, title: fullName,
                                repositoryName: this.props.route.params.repositoryName,
                                userName: this.props.route.params.userName,
                            });
                        }}/>
                );
            case 'release':
                console.log(rowData);
                return (
                    <ReleaseItem
                        actionTime={rowData.published_at}
                        actionTitle={rowData.name ? rowData.name : rowData.tag_name}
                        actionTarget={rowData.target_commitish}
                        actionTargetHtml={rowData.body_html}
                        onPressItem={() => {
                            if (rowData.body_html) {
                                Actions.CodeDetailPage({
                                    title: rowData.name,
                                    needRequest: false,
                                    lang: 'markdown',
                                    detail: generateHtml(rowData.body_html, Constant.webDraculaBackgroundColor),
                                    html_url: rowData.html_url,
                                    clone_url: rowData.clone_url,
                                });
                            }
                        }}
                        onLongPressItem={() => {
                            if (rowData.html_url) {
                                Linking.openURL(rowData.html_url);
                            }
                        }}
                    />
                );
            case 'notify':
                return (
                    <EventItem
                        actionTime={rowData.updated_at}
                        actionUser={rowData.repository.full_name}
                        des={rowData.reason + '  ' + I18n('notifyType', {
                            option1: rowData.subject.type,
                            option2: (rowData.unread) ? I18n('unread') : I18n('readed'),
                        })}
                        actionTarget={rowData.subject.title}
                        onPressItem={() => {
                            if (rowData.unread) {
                                this.props.route.params.onItemClickEx && this.props.route.params.onItemClickEx(rowData.id);
                            }
                            if (rowData.subject.type === 'Issue') {
                                let tmp = rowData.subject.url.split('/');
                                Actions.IssueDetail({
                                    issue: {
                                        user: {},
                                        comments: 0,
                                        state: '',
                                        number: tmp[tmp.length - 1],
                                    },
                                    title: rowData.repository.full_name,
                                    repositoryName: rowData.repository.name,
                                    userName: rowData.repository.owner.login,
                                    needRightBtn: true,
                                    iconType: 1,
                                    rightBtn: 'home',
                                    rightBtnPress: () => {
                                        Actions.RepositoryDetail({
                                            repositoryName: rowData.repository.name,
                                            ownerName: rowData.repository.owner.login,
                                            title: rowData.repository.full_name,
                                        });
                                    },
                                });
                            }
                        }}/>
                );
        }
    }


    /**
     * 刷新
     * */
    _refresh() {
        switch (this.props.route.params.dataType) {
            case 'follower':
                userActions.getFollowerList(this.props.route.params.currentUser, 0)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;
            case 'followed':
                userActions.getFollowedList(this.props.route.params.currentUser, 0)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;
            case 'user_repos':
                repositoryActions.getUserRepository(this.props.route.params.currentUser, 0, this.filterSelect)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;
            case 'user_star':
                repositoryActions.getStarRepository(this.props.route.params.currentUser, 0, this.filterSelect)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;
            case 'repo_star':
                repositoryActions.getRepositoryStar(this.props.route.params.currentUser, this.props.route.params.currentRepository, 0)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;
            case 'repo_watcher':
                repositoryActions.getRepositoryWatcher(this.props.route.params.currentUser, this.props.route.params.currentRepository, 0)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;
            case 'repo_fork':
                repositoryActions.getRepositoryForks(this.props.route.params.currentUser, this.props.route.params.currentRepository, 0)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;
            case 'repo_release':
                repositoryActions.getRepositoryRelease(this.props.route.params.currentUser, this.props.route.params.currentRepository, 0).then((res) => {
                    this._refreshRes(res);
                });
                break;
            case 'repo_tag':
                repositoryActions.getRepositoryTag(this.props.route.params.currentUser, this.props.route.params.currentRepository, 0).then((res) => {
                    this._refreshRes(res);
                });
                break;
            case 'notify':
                userActions.getNotifation(this.props.route.params.all, this.props.route.params.participating, 0).then((res) => {
                    this._refreshRes(res);
                });
                break;
            case 'history':
                repositoryActions.getRepositoryLocalRead(1).then((res) => {
                    this._refreshRes(res);
                });
                break;
            case 'topics':
                repositoryActions.searchTopicRepository(this.props.route.params.topic, 0).then((res) => {
                    this._refreshRes(res);
                });
                break;
            case 'user_be_stared':
                this._refreshRes({result: true, data: this.props.route.params.localData});
                break;
            case 'user_orgs':
                userActions.getUserOrgs(0, this.props.route.params.currentUser)
                    .then((res) => {
                        this.setState({
                            dataSource: res.data,
                        });
                        return res.next();
                    })
                    .then((res) => {
                        this._refreshRes(res);
                    });
                break;


        }


    }

    /**
     * 加载更多
     * */
    _loadMore() {
        switch (this.props.route.params.dataType) {
            case 'follower':
                userActions.getFollowerList(this.props.route.params.currentUser, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'followed':
                userActions.getFollowedList(this.props.route.params.currentUser, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'user_repos':
                repositoryActions.getUserRepository(this.props.route.params.currentUser, this.page, this.filterSelect).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'user_star':
                repositoryActions.getStarRepository(this.props.route.params.currentUser, this.page, this.filterSelect).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'repo_star':
                repositoryActions.getRepositoryStar(this.props.route.params.currentUser, this.props.route.params.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'repo_watcher':
                repositoryActions.getRepositoryWatcher(this.props.route.params.currentUser, this.props.route.params.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'repo_fork':
                repositoryActions.getRepositoryForks(this.props.route.params.currentUser, this.props.route.params.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'repo_release':
                repositoryActions.getRepositoryRelease(this.props.route.params.currentUser, this.props.route.params.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'repo_tag':
                repositoryActions.getRepositoryTag(this.props.route.params.currentUser, this.props.route.params.currentRepository, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'notify':
                userActions.getNotifation(this.props.route.params.all, this.props.route.params.participating, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'history':
                repositoryActions.getRepositoryLocalRead(this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'topics':
                repositoryActions.searchTopicRepository(this.props.route.params.topic, this.page).then((res) => {
                    this._loadMoreRes(res);
                });
                break;
            case 'user_be_stared':
                this._loadMoreRes({result: false});
                break;
            case 'user_orgs':
                userActions.getUserOrgs(this.page, this.props.route.params.currentUser).then((res) => {
                    this._loadMoreRes(res);
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
                dataSource: res.data,
            });
            size = res.data.length;
        }
        setTimeout(() => {
            if (this.pullListRef.current) {
                this.pullListRef.current.refreshComplete((size >= Config.PAGE_SIZE), true);
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
                dataSource: dataList,
            });
            size = res.data.length;
        }
        setTimeout(() => {
            if (this.pullListRef.current) {
                this.pullListRef.current.loadMoreComplete((size >= Config.PAGE_SIZE));
            }
        }, 500);
    }

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref={this.pullListRef}
                    enableRefresh={false}
                    renderRow={(rowData, index) =>
                        this._renderRow(rowData)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={this.state.dataSource}
                />
            </View>
        );
    }
}

ListPage.propTypes = {
    showType: PropTypes.string,
    dataType: PropTypes.string,
    all: PropTypes.bool,
    participating: PropTypes.bool,
    onItemClickEx: PropTypes.func,
    currentUser: PropTypes.string,
    currentRepository: PropTypes.string,
    localData: PropTypes.any,
};

export default ListPage;
