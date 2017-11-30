/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, TextInput, InteractionManager, Keyboard, TouchableOpacity, StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import issueActions from '../store/actions/issue'
import PullListView from './widget/PullLoadMoreListView'
import IssueItem from './widget/IssueItem'
import IssueHead from './widget/IssueHead'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config/'
import {getFullName} from '../utils/htmlUtils'

/**
 * Issue详情
 */
class IssueDetail extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.page = 2;
        this.state = {
            dataSource: [],
            detailInfo: null,
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


    _renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <IssueItem
                markdownBody={true}
                actionTime={rowData.created_at}
                actionUser={rowData.user.login}
                actionUserPic={rowData.user.avatar_url}
                issueComment={rowData.body}/>
        )
    }

    /**
     * 刷新
     * */
    _refresh() {
        let {issue} = this.props;
        issueActions.getIssueComment(0, this.props.userName, this.props.repositoryName, issue.number).then((res) => {
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
        });
        issueActions.getIssueInfo(this.props.userName, this.props.repositoryName, issue.number).then((res) => {
            if (res && res.result) {
                this.setState({
                    detailInfo: res.data
                })
            }
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        let {issue} = this.props;
        issueActions.getIssueComment(this.page, this.props.userName, this.props.repositoryName, issue.number).then((res) => {
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
        });
    }


    render() {
        let {issue} = this.props;
        let header =
            <IssueHead
                actionTime={issue.created_at}
                actionUser={issue.user.login}
                actionUserPic={issue.user.avatar_url}
                issueComment={issue.title}
                commentCount={issue.comments + ""}
                state={issue.state}
                issueDes={(this.state.detailInfo) ? ((I18n('issueInfo') + ": " + this.state.detailInfo.body)) : null}
                issueTag={"#" + issue.number}/>;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <View style={{height: 2, opacity: 0.3}}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    enableRefresh={false}
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
                <View style={[styles.flexDirectionRowNotFlex, {paddingVertical: Constant.normalMarginEdge}, styles.shadowCard]}>
                    <TouchableOpacity style={[styles.flex, styles.centerH]}
                                      onPress={()=>{Actions.TextInputModal()}}>
                        <Text style={[styles.normalText]}>{I18n("issueComment")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex, styles.centerH,
                        {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor},
                        {borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.lineColor},
                    ]}>
                        <Text style={styles.normalText}>{I18n("issueEdit")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex, styles.centerH]}>
                        <Text style={styles.normalText}>{I18n("issueClose")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


IssueDetail.propTypes = {
    issue: PropTypes.object,
    repositoryName: PropTypes.string,
    userName: PropTypes.string,
};


IssueDetail.defaultProps = {
    userName: '',
    repositoryName: '',
    issue: {}
};

export default IssueDetail