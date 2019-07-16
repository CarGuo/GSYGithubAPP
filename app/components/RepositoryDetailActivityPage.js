/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, Text, StatusBar, InteractionManager, StyleSheet, Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions, Tabs} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import eventActions from '../store/actions/event'
import reposActions from '../store/actions/repository'
import PullListView from './widget/PullLoadMoreListView'
import RepositoryHeader from './widget/RepositoryHeader'
import RepositoryPulseItem from './widget/RepositoryPulseItem'
import CommonBottomBar from './common/CommonBottomBar'
import EventItem from './widget/EventItem'
import resolveTime from '../utils/timeUtil'
import * as Config from '../config'
import {getActionAndDes, ActionUtils} from '../utils/eventUtils'

/**
 * 仓库动态页面
 */
class RepositoryDetailActivityPage extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._getBottomItem = this._getBottomItem.bind(this);
        this.page = 2;
        this.state = {
            select: 0,
            pulseData: null,
            dataSource: [],
            dataSourceCommits: [],
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (this.refs.pullList)
                this.refs.pullList.showRefreshState();
            this._refresh(this.state.select);
        })
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {
    }

    _renderRow(rowData) {
        if (this.state.select === 0) {
            let res = getActionAndDes(rowData);
            let fullName = this.props.ownerName + "/" + this.props.repositoryName;
            return (
                <EventItem
                    actionTime={rowData.created_at}
                    actionUser={rowData.actor.display_login}
                    actionUserPic={rowData.actor.avatar_url}
                    des={res.des}
                    onPressItem={() => {
                        ActionUtils(rowData, fullName)
                    }}
                    actionTarget={res.actionStr}/>

            )
        } else if (this.state.select === 1) {
            return (
                <EventItem
                    actionTime={rowData.commit.committer.date}
                    actionUser={rowData.commit.committer.name}
                    des={"sha:" + rowData.sha}
                    onPressItem={() => {
                        Actions.PushDetailPage({
                            repositoryName: this.props.repositoryName, userName: this.props.ownerName
                            , title: this.props.ownerName + "/" + this.props.repositoryName,
                            sha: rowData.sha,
                        });
                    }}
                    actionTarget={rowData.commit.message}/>

            )
        } else if (this.state.select === 2) {
            let openStatus = this.state.pulseData.issueOpenStatus ? this.state.pulseData.issueOpenStatus : "";
            let closeStatus = this.state.pulseData.issueClosedStatus ? this.state.pulseData.issueClosedStatus : "";
            let statusText = openStatus + closeStatus;
            return (
                <RepositoryPulseItem
                    opened={this.state.pulseData.openIssue}
                    statusText={statusText}
                    infoText={this.state.pulseData.des}
                    closed={this.state.pulseData.closedIssue}/>
            )
        }
    }

    /**
     * 刷新
     * */
    _refresh(select) {
        if (!select) {
            select = this.state.select;
        }
        if (select === 0) {
            eventActions.getRepositoryEvent(0, this.props.ownerName, this.props.repositoryName)
                .then((res) => {
                    if (res && res.result) {
                        let dataList = res.data;
                        this.setState({
                            dataSource: dataList
                        });
                    }
                    return res.next();
                })
                .then((res) => {
                    let size = 0;
                    if (res && res.result) {
                        this.page = 2;
                        let dataList = res.data;
                        this.setState({
                            dataSource: dataList
                        });
                        size = res.data.length;
                    }
                    if (this.refs.pullList) {
                        this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE), true);
                    }
                })
        } else if (select === 1) {
            reposActions.getReposCommits(0, this.props.ownerName, this.props.repositoryName)
                .then((res) => {
                    if (res && res.result) {
                        let dataList = res.data;
                        this.setState({
                            dataSourceCommits: dataList
                        });
                    }
                    return res.next();
                })
                .then((res) => {
                    let size = 0;
                    if (res && res.result) {
                        this.page = 2;
                        let dataList = res.data;
                        this.setState({
                            dataSourceCommits: dataList
                        });
                        size = res.data.length;
                    }
                    if (this.refs.pullList) {
                        this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE), true);
                    }
                })

        } else if (select === 2) {
            if (this.state.pulseData) {
                if (this.refs.pullList) {
                    this.refs.pullList.refreshComplete(false);
                }
                return
            }
            reposActions.getPulse(this.props.ownerName, this.props.repositoryName).then((res) => {
                if (res && res.result) {
                    this.setState({
                        pulseData: res.data
                    })
                }
                return res.next()
            }).then((res) => {
                if (res && res.result) {
                    this.setState({
                        pulseData: res.data
                    })
                }
                if (this.refs.pullList) {
                    this.refs.pullList.refreshComplete(false);
                }
            });
        }
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        if (this.state.select === 0) {
            eventActions.getRepositoryEvent(this.page, this.props.ownerName, this.props.repositoryName).then((res) => {
                let size = 0;
                if (res && res.result) {
                    this.page++;
                    let dataList = this.state.dataSource.concat(res.data);
                    this.setState({
                        dataSource: dataList
                    });
                    size = res.data.length;
                }
                if (this.refs.pullList) {
                    this.refs.pullList.loadMoreComplete((size >= Config.PAGE_SIZE));
                }
            })
        } else if (this.state.select === 1) {
            reposActions.getReposCommits(this.page, this.props.ownerName, this.props.repositoryName).then((res) => {
                let size = 0;
                if (res && res.result) {
                    this.page++;
                    let dataList = this.state.dataSourceCommits.concat(res.data);
                    this.setState({
                        dataSourceCommits: dataList
                    });
                    size = res.data.length;
                }
                if (this.refs.pullList) {
                    this.refs.pullList.loadMoreComplete((size >= Config.PAGE_SIZE));
                }
            })

        } else if (this.state.select === 2) {
            if (this.refs.pullList) {
                this.refs.pullList.loadMoreComplete(false);
            }
        }
    }

    _getBottomItem() {
        let {select} = this.state;
        return [{
            itemName: I18n("reposActivity"),
            itemTextColor: select === 0 ? Constant.white : Constant.subTextColor,
            icon: select === 0 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    select: 0,
                });
                this._refresh(0);
            }, itemStyle: {}
        }, {
            itemName: I18n("reposPush"),
            itemTextColor: select === 1 ? Constant.white : Constant.subTextColor,
            icon: select === 1 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    select: 1,
                });
                this._refresh(1);
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
            }
        }, {
            itemName: 'Pulse',
            itemTextColor: select === 2 ? Constant.white : Constant.subTextColor,
            icon: select === 2 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    select: 2,
                });
                this._refresh(2);
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
            }
        },]
    }

    _renderHeader() {
        let {
            forks_count, fork, open_issues_count, size, watchers_count, owner,
            subscribers_count, description, language, created_at, pushed_at, parent,
            topics, license, all_issues_count, closed_issues_count
        } = this.props.dataDetail;
        return <View>
                <RepositoryHeader
                    ownerName={this.props.ownerName}
                    ownerPic={owner ? owner.avatar_url : ""}
                    repositoryName={this.props.repositoryName}
                    repositoryStar={watchers_count + ""}
                    repositoryFork={forks_count + ""}
                    repositoryWatch={subscribers_count + ""}
                    repositoryIssue={open_issues_count + ""}
                    repositoryIssueClose={closed_issues_count ? (closed_issues_count + "") : null}
                    repositoryIssueAll={all_issues_count ? (all_issues_count + "") : null}
                    repositorySize={(size / 1024).toFixed(2) + "M"}
                    repositoryType={language}
                    repositoryDes={description}
                    repositoryIsFork={fork}
                    topics={topics}
                    license={license ? license.name : ""}
                    repositoryParentName={parent ? parent.full_name : null}
                    created_at={resolveTime(created_at)}
                    push_at={resolveTime(pushed_at)}
                />
                <CommonBottomBar
                    rootStyles={{
                        marginHorizontal: Constant.normalMarginEdge,
                        backgroundColor: Constant.primaryColor,
                        marginTop: Constant.normalMarginEdge,
                        borderRadius: 4,
                    }}
                    dataList={this._getBottomItem()}/>
            </View>;
    }

    render() {
        let data = this.state.select === 0 ? this.state.dataSource : this.state.dataSourceCommits;


        if (this.state.select === 2) {
            data = [];
            if (this.state.pulseData)
                data.push(this.state.pulseData);
        }

        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    renderRow={(rowData, index) =>
                        this._renderRow(rowData)
                    }
                    renderHeader={this._renderHeader()}
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={data}
                />
            </View>
        )
    }
}

RepositoryDetailActivityPage.propTypes = {
    dataDetail: PropTypes.object,
    ownerName: PropTypes.string,
    repositoryName: PropTypes.string,
};


RepositoryDetailActivityPage.defaultProps = {
    dataDetail: {},
    ownerName: '',
    repositoryName: '',
};


export default RepositoryDetailActivityPage