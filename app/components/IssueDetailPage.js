/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, TextInput, InteractionManager, Keyboard, TouchableOpacity, StyleSheet, Clipboard
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
import CommonBottomBar from './common/CommonBottomBar'
import * as Config from '../config'
import {isCommentOwner} from '../utils/issueUtils'
import Toast from "./common/ToastProxy";

/**
 * Issue详情
 */
class IssueDetailPage extends Component {

    constructor(props) {
        super(props);
        this._getBottomItem = this._getBottomItem.bind(this);
        this._getOptionItem = this._getOptionItem.bind(this);
        this._refresh = this._refresh.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.sendIssueComment = this.sendIssueComment.bind(this);
        this.editIssue = this.editIssue.bind(this);
        this.editComment = this.editComment.bind(this);
        this.closeIssue = this.closeIssue.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.lockedIssue = this.lockedIssue.bind(this);
        this.page = 2;
        this.actionUser = new Map();
        this.state = {
            dataSource: [],
            issue: this.props.issue
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (this.refs.pullList)
                this.refs.pullList.showRefreshState();
            this._refresh();
        })
    }

    componentWillUnmount() {

    }


    _renderRow(rowData, rowID) {
        return (
            <IssueItem
                markdownBody={true}
                actionTime={rowData.created_at}
                actionUser={rowData.user.login}
                actionUserPic={rowData.user.avatar_url}
                issueComment={rowData.body}
                onLongPressItem={() => {
                    if (isCommentOwner(this.props.userName, rowData.user.login)) {
                        Actions.OptionModal({dataList: this._getOptionItem(rowData, rowID, true)});
                    } else {
                        Actions.OptionModal({dataList: this._getOptionItem(rowData, rowID, false)});
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
                if (res && res.result) {
                    let dataList = this.state.dataSource;
                    dataList.push(res.data);
                    this.setState({
                        dataSource: dataList
                    })
                } else {
                    Actions.TextInputModal({
                        needEditTitle: false,
                        textConfirm: this.sendIssueComment,
                        text: text,
                        titleText: I18n('commentsIssue'),
                        bottomBar: true,
                        userList: [...this.actionUser.values()]
                    })
                }
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
                if (res && res.result) {
                    this.setState({
                        issue: res.data
                    })
                } else {
                    Actions.TextInputModal({
                        textConfirm: this.editIssue,
                        titleText: I18n('editIssue'),
                        needEditTitle: true,
                        text: text,
                        titleValue: title,
                        bottomBar: true,
                        userList: [...this.actionUser.values()]
                    })
                }
            }, 500);
        })
    }

    editComment(commentId, text, rowID) {
        let {repositoryName, userName} = this.props;
        let {issue} = this.state;
        Actions.LoadingModal({backExit: false});
        issueActions.editComment(userName, repositoryName, issue.number, commentId,
            {body: text}).then((res) => {
            setTimeout(() => {
                Actions.pop();
                if (res && res.result) {
                    let dataList = this.state.dataSource;
                    dataList.splice(parseInt(rowID), 1, res.data);
                    this.setState({
                        dataSource: dataList
                    })
                } else {
                    Actions.TextInputModal({
                        textConfirm: (text) => {
                            this.editComment(commentId, text, rowID)
                        },
                        titleText: I18n('editIssue'),
                        needEditTitle: false,
                        text: text,
                        bottomBar: true,
                        userList: [...this.actionUser.values()]
                    })
                }
            }, 500);
        })
    }

    deleteComment(commentId, rowID) {
        let {repositoryName, userName} = this.props;
        let {number} = this.state.issue;
        Actions.LoadingModal({backExit: false});
        issueActions.editComment(userName, repositoryName, number, commentId, null, 'delete').then((res) => {
            setTimeout(() => {
                Actions.pop();
                if (res && res.result) {
                    let dataList = this.state.dataSource;
                    dataList.splice(parseInt(rowID), 1);
                    this.setState({
                        dataSource: dataList
                    })
                }
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
                if (res && res.result) {
                    this.setState({
                        issue: res.data
                    })
                }
            }, 500);
        })
    }


    lockedIssue() {
        let {repositoryName, userName} = this.props;
        let {issue} = this.state;
        Actions.LoadingModal({backExit: false});
        issueActions.lockIssue(userName, repositoryName, issue.number, issue.locked).then((res) => {
            setTimeout(() => {
                Actions.pop();
                if (res && res.result && res.data) {
                    this.setState({
                        issue: res.data
                    })
                }
            }, 500);
        })
    }

    /**
     * 刷新
     * */
    _refresh() {
        let {issue} = this.state;
        issueActions.getIssueComment(1, this.props.userName, this.props.repositoryName, issue.number)
            .then((res) => {
                if (res && res.result) {
                    let dataList = res.data;
                    this.setState({
                        dataSource: dataList
                    });
                    Actions.refresh({titleData: res.data});
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
                    if (dataList) {
                        this.actionUser = new Map();
                        dataList.forEach((item) => {
                            if (!this.actionUser.has(item.user.login)) {
                                this.actionUser.set(item.user.login, item.user.login);
                            }
                        })
                    }

                }
                if (this.refs.pullList) {
                    this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE));
                }
            });
        issueActions.getIssueInfo(this.props.userName, this.props.repositoryName, issue.number)
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        issue: res.data,
                    })
                }
                return res.next();
            })
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        issue: res.data,
                    });
                    Actions.refresh({titleData: res.data});
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
                if (dataList) {
                    dataList.forEach((item) => {
                        if (!this.actionUser.has(item.user.login)) {
                            this.actionUser.set(item.user.login, item.user.login);
                        }
                    })
                }
            }
            if (this.refs.pullList) {
                this.refs.pullList.loadMoreComplete((size >= Config.PAGE_SIZE));
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
                    text: "",
                    titleText: I18n('commentsIssue'),
                    bottomBar: true,
                    userList: [...this.actionUser.values()]
                })
            }, itemStyle: {}
        }, {
            itemName: I18n("issueEdit"),
            itemClick: () => {
                Actions.TextInputModal({
                    textConfirm: this.editIssue,
                    titleText: I18n('editIssue'),
                    needEditTitle: true,
                    text: this.state.issue.body,
                    titleValue: issue.title,
                    bottomBar: true,
                    userList: [...this.actionUser.values()]
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
            }, itemStyle: {
                borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.lineColor
            }
        }, {
            itemName: (issue.locked) ? I18n('issueUnlock') : I18n('issueLocked'),
            itemClick: () => {
                Actions.ConfirmModal({
                    titleText: (issue.locked) ? I18n('issueUnlock') : I18n('issueLocked'),
                    text: (issue.locked) ? I18n('lockIssueTip') : I18n('unLockIssueTip'),
                    textConfirm: this.lockedIssue
                })
            }, itemStyle: {}
        },]
    }


    _getOptionItem(data, rowID, owner) {
        let copy = [{
            itemName: I18n("copyComment"),
            itemClick: () => {
                Clipboard.setString(data.body);
                Toast(I18n("hadCopy"));
            }, itemStyle: {
                borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
            }
        }];
        let action = [{
            itemName: I18n("issueCommentEdit"),
            itemClick: () => {
                Actions.TextInputModal({
                    textConfirm: (text) => {
                        this.editComment(data.id, text, rowID)
                    },
                    titleText: I18n('editIssue'),
                    needEditTitle: false,
                    text: data.body,
                    bottomBar: true,
                    userList: [...this.actionUser.values()]
                })
            }, itemStyle: {}
        }, {
            itemName: I18n("issueCommentDelete"),
            itemClick: () => {
                this.deleteComment(data.id, rowID);
            }, itemStyle: {
                borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
            }
        },];
        let ownerAction = action.concat(copy);
        return owner ? ownerAction : copy;
    }

    _renderHeader() {
        let {issue} = this.state;
        return <IssueHead
            actionTime={issue.created_at}
            actionUser={issue.user.login}
            actionUserPic={issue.user.avatar_url}
            closed_by={issue.closed_by}
            locked={issue.locked}
            issueComment={issue.title}
            issueDesHtml={issue.body_html ? issue.body_html : ""}
            commentCount={issue.comments + ""}
            state={issue.state}
            issueDes={(issue.body) ? ((I18n('issueInfo') + ": \n" + issue.body)) : ''}
            issueTag={"#" + issue.number}/>;
    }

    render() {
        let {issue} = this.state;
        let bottomBar = (issue) ?
            <CommonBottomBar dataList={this._getBottomItem()}/> :
            <View/>;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <View style={{height: 2, opacity: 0.3}}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    enableRefresh={false}
                    renderRow={(rowData, index) =>
                        this._renderRow(rowData, index)
                    }
                    renderHeader={this._renderHeader()}
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={this.state.dataSource}
                />
                {bottomBar}
            </View>
        )
    }
}


IssueDetailPage.propTypes = {
    issue: PropTypes.object,
    repositoryName: PropTypes.string,
    userName: PropTypes.string,
};


IssueDetailPage.defaultProps = {
    userName: '',
    repositoryName: '',
    issue: {}
};

export default IssueDetailPage