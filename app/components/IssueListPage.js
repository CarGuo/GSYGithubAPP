/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, InteractionManager, StatusBar, TextInput, TouchableOpacity, Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import issueActions from '../store/actions/issue'
import PullListView from './widget/PullLoadMoreListView'
import IssueItem from './widget/IssueItem'
import {getFullName} from '../utils/htmlUtils'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config/'


/**
 * 搜索
 */
class IssueListPage extends Component {

    constructor(props) {
        super(props);
        this._searchTextChange = this._searchTextChange.bind(this);
        this._searchText = this._searchText.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.searchText = "";
        this.page = 2;
        this.selectTypeData = null;
        this.selectSortData = null;
        this.selectLanguageData = null;
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            issueActions.getRepositoryIssue(0, this.props.userName, this.props.repositoryName).then((res) => {
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
        });
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {
        let changed = false;
        if (newProps.selectTypeData !== this.selectTypeData) {
            this.selectTypeData = newProps.selectTypeData;
            changed = true;
        }
        if (newProps.selectSortData !== this.selectSortData) {
            this.selectSortData = newProps.selectSortData;
            changed = true;
        }
        if (newProps.selectLanguageData !== this.selectLanguageData) {
            this.selectLanguageData = newProps.selectLanguageData;
            changed = true;
        }
        if (changed) {
            this._searchText();
        }
    }

    _searchTextChange(text) {
        this.searchText = text;
    }

    _searchText() {
        Keyboard.dismiss();
        if (this.searchText === null || this.searchText.trim().length === 0) {
            if (this.refs.pullList) {
                this.refs.pullList.refreshComplete(false);
            }
            return
        }
        if (this.refs.pullList) {
            this.refs.pullList.showRefreshState();
        }
        /*repositoryActions.searchRepository(this.searchText, this.selectLanguageData, this.selectTypeData, this.selectSortData, 1).then((res) => {
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
        });*/
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        let fullName = getFullName(rowData.repository_url);
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
        issueActions.getRepositoryIssue(this.page, this.props.userName, this.props.repositoryName).then((res) => {
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

                    <TouchableOpacity
                        style={[styles.centered, {marginTop: 2, marginHorizontal: Constant.normalMarginEdge}]}
                        onPress={() => {
                            this._searchText()
                        }}>
                        <Icon name={'md-search'} size={28} color={Constant.subLightTextColor}/>
                    </TouchableOpacity>
                </View>
                <View style={{height: 2, opacity: 0.3}}/>
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


IssueListPage.propTypes = {
    userName: PropTypes.string,
    repositoryName: PropTypes.string,
};


IssueListPage.defaultProps = {
    userName: '',
    repositoryName: '',
};

export default IssueListPage