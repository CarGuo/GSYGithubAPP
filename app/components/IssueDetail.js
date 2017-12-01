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
import CommonBottomBar from './widget/CommonBottomBar'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config/'
import {generateMdSampleHtml} from '../utils/htmlUtils'
import {isCommentOwner} from '../utils/issueUtils'

/**
 * Issue详情
 */
class IssueDetail extends Component {

    constructor(props) {
        super(props);
        this._getBottomItem = this._getBottomItem.bind(this);
        this._getOptionItem = this._getOptionItem.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.sendIssueComment = this.sendIssueComment.bind(this);
        this.editIssue = this.editIssue.bind(this);
        this.editComment = this.editComment.bind(this);
        this.closeIssue = this.closeIssue.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.page = 2;
        this.state = {
            dataSource: [],
            issue: this.props.issue
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
                issueComment={rowData.body}
                onLongPressItem={() => {
                    if (isCommentOwner(this.props.userName, rowData.user.login)) {
                        Actions.OptionModal({dataList: this._getOptionItem(rowData)});
                    }
                }}
                issueCommentHtml={rowData.body_html}/>
        )
    }

    sendIssueComment(text) {
        let {repositoryName, userName} = this.props;
        let {issue} = this.state;
        Actions.LoadingModal({backExit: false});
        issueActions.addIssueComment(userName, repositoryName, issue.number, text).then((res) => {
            setTimeout(() => {
                Actions.pop();
                this._refresh();
            }, 500);
        });

    }

    editIssue(text, title) {
        if (!title || title.length === 0) {
            return
        }
        let {repositoryName, userName} = this.props;
        let {issue} = this.state;
        Actions.LoadingModal({backExit: false});
        issueActions.editIssue(userName, repositoryName, issue.number,
            {title: title, body: text}).then((res) => {
            setTimeout(() => {
                Actions.pop();
                this._refresh();
            }, 500);
        })
    }

    editComment(commentId, text) {
        let {repositoryName, userName} = this.props;
        Actions.LoadingModal({backExit: false});
        issueActions.editComment(userName, repositoryName, commentId,
            {body: text}).then(() => {
            setTimeout(() => {
                Actions.pop();
                this._refresh();
            }, 500);
        })
    }

    deleteComment(commentId) {
        let {repositoryName, userName} = this.props;
        Actions.LoadingModal({backExit: false});
        issueActions.editComment(userName, repositoryName, commentId, null, 'delete').then(() => {
            setTimeout(() => {
                Actions.pop();
                this._refresh();
            }, 500);
        })
    }

    closeIssue() {
        let {repositoryName, userName} = this.props;
        let {issue} = this.state;
        Actions.LoadingModal({backExit: false});
        issueActions.editIssue(userName, repositoryName, issue.number,
            {state: (issue.state === "closed") ? 'open' : 'closed'}).then((res) => {
            setTimeout(() => {
                Actions.pop();
                this._refresh();
            }, 500);
        })
    }

    /**
     * 刷新
     * */
    _refresh() {
        let {issue} = this.state;
        issueActions.getIssueComment(1, this.props.userName, this.props.repositoryName, issue.number).then((res) => {
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
                    issue: res.data,
                })
            }
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        let {issue} = this.state;
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


    _getBottomItem() {
        let {issue} = this.state;
        return [{
            itemName: I18n("issueComment"),
            itemClick: () => {
                Actions.TextInputModal({
                    needEditTitle: false,
                    textConfirm: this.sendIssueComment,
                    titleText: I18n('commentsIssue'),
                })
            }, itemStyle: {}
        }, {
            itemName: I18n("issueEdit"),
            itemClick: () => {
                Actions.TextInputModal({
                    textConfirm: this.editIssue,
                    titleText: I18n('editIssue'),
                    needEditTitle: true,
                    text: issue.title,
                    titleValue: this.state.issue.body
                })
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
                borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.lineColor
            }
        }, {
            itemName: (issue.state === "open") ? I18n('issueClose') : I18n('issueOpen'),
            itemClick: () => {
                Actions.ConfirmModal({
                    titleText: (issue.state === "open") ? I18n('closeIssue') : I18n('openIssue'),
                    text: (issue.state === "open") ? I18n('closeIssueTip') : I18n('openIssueTip'),
                    textConfirm: this.closeIssue
                })
            }, itemStyle: {}
        },]
    }


    _getOptionItem(data) {
        return [{
            itemName: I18n("issueCommentEdit"),
            itemClick: () => {
                Actions.TextInputModal({
                    textConfirm: (text) => {
                        this.editComment(data.id, text)
                    },
                    titleText: I18n('editIssue'),
                    needEditTitle: false,
                    text: data.body,
                })
            }, itemStyle: {}
        }, {
            itemName: I18n("issueCommentDelete"),
            itemClick: () => {
                this.deleteComment(data.id);
            }, itemStyle: {
                borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
            }
        },]
    }

    render() {
        let {issue} = this.state;
        let bottomBar = (issue.body) ?
            <CommonBottomBar dataList={this._getBottomItem()}/> :
            <View/>;
        let header =
            <IssueHead
                actionTime={issue.created_at}
                actionUser={issue.user.login}
                actionUserPic={issue.user.avatar_url}
                issueComment={issue.title}
                issueDesHtml={generateMdSampleHtml(issue.body)}
                commentCount={issue.comments + ""}
                state={issue.state}
                issueDes={(issue.body) ? ((I18n('issueInfo') + ": \n" + issue.body)) : null}
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
                {bottomBar}
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