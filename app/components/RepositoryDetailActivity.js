/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, Text, StatusBar, InteractionManager, ScrollView, Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions, Tabs} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import eventActions from '../store/actions/event'
import PullListView from './widget/PullLoadMoreListView'
import RepositoryHeader from './widget/RepositoryHeader'
import EventItem from './widget/EventItem'
import resolveTime from '../utils/timeUtil'
import * as Config from '../config/'
import {getActionAndDes} from '../utils/eventUtils'

/**
 * 详情
 */
class RepositoryDetailActivity extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.page = 2;
        this.state = {
            dataSource: []
        };
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
        let res = getActionAndDes(rowData);
        return (
            <EventItem
                actionTime={rowData.created_at}
                actionUser={rowData.actor.display_login}
                actionUserPic={rowData.actor.avatar_url}
                des={res.des}
                actionTarget={res.actionStr}/>
        )
    }

    /**
     * 刷新
     * */
    _refresh() {
        eventActions.getRepositoryEvent(0, this.props.ownerName, this.props.repositoryName).then((res) => {
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
                this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE));
            }
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
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
                this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE));
            }
        })
    }


    render() {
        let {
            forks_count, fork, open_issues_count, size, watchers_count, owner,
            subscribers_count, description, language, created_at, pushed_at, parent,
        } = this.props.dataDetail;
        let header =
            <RepositoryHeader
                ownerName={this.props.ownerName}
                ownerPic={owner ? owner.avatar_url : ""}
                repositoryName={this.props.repositoryName}
                repositoryStar={watchers_count + ""}
                repositoryFork={forks_count + ""}
                repositoryWatch={subscribers_count + ""}
                repositoryIssue={open_issues_count + ""}
                repositorySize={(size / 1024).toFixed(2) + "M"}
                repositoryType={language}
                repositoryDes={description}
                repositoryIsFork={fork}
                repositoryParentName={parent ? parent.full_name : null}
                created_at={resolveTime(created_at)}
                push_at={resolveTime(pushed_at)}
            />;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    renderRow={(rowData, sectionID, rowID, highlightRow) =>
                        this._renderRow(rowData, sectionID, rowID, highlightRow)
                    }
                    renderHeader={() => {
                        return header
                    }}
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={this.state.dataSource}
                />
            </View>
        )
    }
}

RepositoryDetailActivity.propTypes = {
    dataDetail: PropTypes.object,
    ownerName: PropTypes.string,
    repositoryName: PropTypes.string,
};


RepositoryDetailActivity.defaultProps = {
    dataDetail: {},
    ownerName: '',
    repositoryName: '',
};


export default RepositoryDetailActivity