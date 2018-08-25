/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, InteractionManager, StatusBar, TextInput, TouchableOpacity, Keyboard, StyleSheet, Platform
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import styles, {screenWidth, screenHeight} from "../style"
import * as Constant from "../style/constant"
import repositoryActions from "../store/actions/repository"
import I18n from '../style/i18n'
import issueActions from '../store/actions/issue'
import PullListView from './widget/PullLoadMoreListView'
import IssueItem from './widget/IssueItem'
import {getFullName} from '../utils/htmlUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config'
import CommonBottomBar from "./common/CommonBottomBar";
import {CommonMoreRightBtnPress} from '../utils/actionUtils'

/**
 * 仓库issue列表
 */
class RepositoryIssueListPage extends Component {

    constructor(props) {
        super(props);
        this._searchTextChange = this._searchTextChange.bind(this);
        this._createIssue = this._createIssue.bind(this);
        this._searchText = this._searchText.bind(this);
        this._refresh = this._refresh.bind(this);
        this._getBottomItem = this._getBottomItem.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.searchText = "";
        this.filter = null;
        this.page = 2;
        this.selectTypeData = null;
        this.selectSortData = null;
        this.selectLanguageData = null;
        this.state = {
            select: 0,
            dataSource: []
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._searchText();
        });
    }

    componentWillUnmount() {

    }

    _searchTextChange(text) {
        this.searchText = text;
    }

    _searchText() {
        Keyboard.dismiss();
        if (this.refs.pullList) {
            this.refs.pullList.refreshComplete(false);
        }
        if (this.refs.pullList) {
            this.refs.pullList.showRefreshState();
        }
        if (this.searchText === null || this.searchText.trim().length === 0) {
            issueActions.getRepositoryIssue(0, this.props.userName, this.props.repositoryName, this.filter)
                .then((res) => {
                    if (res && res.result) {
                        let dataList = res.data;
                        this.setState({
                            dataSource: dataList
                        });
                    }
                    return res.next();
                }).then((res) => {
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
            });
            return
        }
        repositoryActions.searchRepositoryIssue(this.searchText, this.props.userName, this.props.repositoryName, 1, this.filter).then((res) => {
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
                    this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE), true);
                }
            }, 500);
        });
    }

    _renderRow(rowData) {
        let fullName = getFullName(rowData.repository_url);
        return (
            <IssueItem
                actionTime={rowData.created_at}
                actionUser={rowData.user.login}
                actionUserPic={rowData.user.avatar_url}
                issueComment={fullName + "- " + rowData.title}
                commentCount={rowData.comments + ""}
                state={rowData.state}
                issueTag={"#" + rowData.number}
                onPressItem={() => {
                    Actions.IssueDetail({
                        iconType:2,
                        rightBtn: 'ios-more',
                        needRightBtn: true,
                        issue: rowData, title: fullName,
                        repositoryName: this.props.repositoryName,
                        userName: this.props.userName,
                        rightBtnPress: (params) => {
                            return CommonMoreRightBtnPress(params)
                        }
                    })
                }}/>
        )
    }

    /**
     * 刷新
     * */
    _refresh() {
        this._searchText();
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        if (this.searchText === null || this.searchText.trim().length === 0) {
            issueActions.getRepositoryIssue(this.page, this.props.userName, this.props.repositoryName, this.filter).then((res) => {
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
            });
            return
        }
        repositoryActions.searchRepositoryIssue(this.searchText, this.props.userName, this.props.repositoryName, this.page, this.filter).then((res) => {
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
        });
    }

    _getBottomItem() {
        let {select} = this.state;
        return [{
            itemName: I18n("issueAllText"),
            itemTextColor: select === 0 ? Constant.white : Constant.subTextColor,
            icon: select === 0 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    select: 0,
                    dataSource: [],
                });
                this.filter = null;
                this._searchText()
            }, itemStyle: {}
        }, {
            itemName: I18n("issueOpenText"),
            itemTextColor: select === 1 ? Constant.white : Constant.subTextColor,
            icon: select === 1 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    select: 1,
                    dataSource: [],
                });
                this.filter = 'open';
                this._searchText()
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
            }
        }, {
            itemName: I18n("issueCloseText"),
            itemTextColor: select === 2 ? Constant.white : Constant.subTextColor,
            icon: select === 2 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    select: 2,
                    dataSource: [],
                });
                this.filter = 'closed';
                this._searchText()
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
            }
        }]
    }

    _createIssue(text, title) {
        let {repositoryName, userName} = this.props;
        Actions.LoadingModal({backExit: false});
        issueActions.createIssue(userName, repositoryName,
            {title: title, body: text}).then((res) => {
            setTimeout(() => {
                Actions.pop();
                if (res && res.data) {
                    let data = this.state.dataSource;
                    data.splice(0, 0, res.data);
                    this.setState({
                        dataSource: data,
                    })
                }
            }, 500);
        })
    }

    render() {
        let btnStyle = (Platform.OS === "android") ? [styles.shadowCard, {
            width: 48,
            height: 48,
            borderRadius: 25,
            shadowOffset: {
                width: 2,
                height: 2
            },
        }] : [{backgroundColor: Constant.transparentColor}];
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <View style={[styles.flexDirectionRowNotFlex, styles.shadowCard, {
                    backgroundColor: '#FFF',
                    borderBottomRightRadius: 4,
                    borderBottomLeftRadius: 4,
                    height: 40,
                    paddingVertical: Constant.normalMarginEdge / 3,
                }]}>
                    <TextInput
                        onChangeText={(text) => {
                            this._searchTextChange(text)
                        }}
                        placeholder={I18n('search')}
                        returnKeyType={'search'}
                        returnKeyLabel={'search'}
                        onSubmitEditing={(event) => {
                            this.searchText = event.nativeEvent.text;
                            this._searchText()
                        }}
                        underlineColorAndroid="transparent"
                        clearButtonMode="always"
                        style={[styles.smallText, {
                            padding: 0,
                            paddingLeft: Constant.normalMarginEdge / 2,
                            marginHorizontal: Constant.normalMarginEdge / 2,
                            borderRadius: 3,
                            backgroundColor: Constant.subLightTextColor,
                        }, styles.flex]}/>
                </View>
                <View style={[styles.centerH, styles.flexDirectionRowNotFlex]}>
                    <CommonBottomBar
                        rootStyles={{
                            flex: 1,
                            marginHorizontal: Constant.normalMarginEdge,
                            backgroundColor: Constant.primaryColor,
                            marginTop: Constant.normalMarginEdge,
                            borderRadius: 4,
                        }}
                        dataList={this._getBottomItem()}/>
                </View>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    enableRefresh={false}
                    renderRow={(rowData, index) =>
                        this._renderRow(rowData)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={this.state.dataSource}
                />
                <TouchableOpacity
                    style={[{
                        position: "absolute",
                        left: screenWidth - 60,
                        top: screenHeight - 230,
                        right: 0,
                        bottom: 0,
                        zIndex: 222,
                    }]}
                    onPress={() => {
                        Actions.TextInputModal({
                            textConfirm: this._createIssue,
                            titleText: I18n('createIssue'),
                            needEditTitle: true,
                            text: "",
                            titleValue: "",
                            bottomBar: true,
                        })
                    }}>
                    <View
                        style={[styles.centered, ...btnStyle]}>
                        <Icon name={'md-add-circle'}
                              style={{backgroundColor: Constant.transparentColor}}
                              backgroundColor={Constant.transparentColor}
                              size={50} color={Constant.primaryColor}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}


RepositoryIssueListPage.propTypes = {
    userName: PropTypes.string,
    repositoryName: PropTypes.string,
};


RepositoryIssueListPage.defaultProps = {
    userName: '',
    repositoryName: '',
};

export default RepositoryIssueListPage