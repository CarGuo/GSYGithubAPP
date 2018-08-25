/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Keyboard
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import repositoryActions from '../store/actions/repository'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import EventItem from './widget/EventItem'
import CommonBottomBar from './common/CommonBottomBar'
import UserItem from './widget/UserItem'
import PullListView from './widget/PullLoadMoreListView'
import RepositoryItem from './widget/RepositoryItem'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config'


/**
 * 搜索
 */
class SearchPage extends Component {

    constructor(props) {
        super(props);
        this._searchTextChange = this._searchTextChange.bind(this);
        this._searchText = this._searchText.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._getBottomItem = this._getBottomItem.bind(this);
        this.searchText = "";
        this.page = 2;
        this.selectTypeData = null;
        this.selectSortData = null;
        this.selectLanguageData = null;
        this.select = 0;
        this.state = {
            showSelect: 0,
            dataSource: [],
        }
    }

    componentDidMount() {
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
            this._refresh();
        }
    }

    _searchTextChange(text) {
        this.searchText = text;
    }

    _searchText(select) {
        Keyboard.dismiss();
        let type = (select === 0) ? null : 'user';
        if (this.searchText === null || this.searchText.trim().length === 0) {
            if (this.refs.pullList) {
                this.refs.pullList.refreshComplete(false);
            }
            return
        }
        if (this.refs.pullList) {
            this.refs.pullList.loadMoreComplete();
            this.refs.pullList.showRefreshState();
        }
        repositoryActions.searchRepository(this.searchText, this.selectLanguageData, this.selectTypeData, this.selectSortData, type, 1).then((res) => {
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
                    this.refs.pullList.scrollToTop()
                }
            }, 500);
        });
    }

    _renderRow(rowData) {
        if (this.select === 0) {
            return (
                <RepositoryItem
                    ownerName={rowData.owner.login}
                    ownerPic={rowData.owner.avatar_url}
                    repositoryName={rowData.name}
                    repositoryStar={rowData.watchers_count + ""}
                    repositoryFork={rowData.forks_count + ""}
                    repositoryWatch={rowData.open_issues + ""}
                    repositoryType={rowData.language}
                    repositoryDes={(rowData.description) ? rowData.description : '---'}
                />
            )
        } else {
            return (
                <UserItem
                    location={rowData.location}
                    actionUser={rowData.login}
                    actionUserPic={rowData.avatar_url}
                    des={rowData.bio}/>
            );
        }
    }

    /**
     * 刷新
     * */
    _refresh(select) {
        if (!select) {
            select = this.select;
        }
        this._searchText(select);
    }

    /**
     * 加载更多
     * */
    _loadMore(select) {
        if (!select) {
            select = this.select;
        }
        let type = (select === 0) ? null : 'user';
        repositoryActions.searchRepository(this.searchText, this.selectLanguageData, this.selectTypeData, this.selectSortData, type, this.page).then((res) => {
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
                    this.refs.pullList.loadMoreComplete((size >= Config.PAGE_SIZE));
                }
            }, 500);
        });
    }

    _getBottomItem() {
        let select = this.state.showSelect;
        return [{
            itemName: I18n("searchRepos"),
            itemTextColor: select === 0 ? Constant.white : Constant.subTextColor,
            icon: select === 0 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    showSelect: 0,
                    dataSource: []
                });
                this.select = 0;
                this._refresh(0);
            }, itemStyle: {}
        }, {
            itemName: I18n("searchUser"),
            itemTextColor: select === 1 ? Constant.white : Constant.subTextColor,
            icon: select === 1 ? "check" : null,
            iconColor: Constant.white,
            itemClick: () => {
                this.setState({
                    showSelect: 1,
                    dataSource: []
                });
                this.select = 1;
                this._refresh(1);
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
            }
        },]
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
                            this._refresh()
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
                            this._refresh()
                        }}>
                        <Icon name={'md-search'} size={28} color={Constant.subLightTextColor}/>
                    </TouchableOpacity>
                </View>
                <CommonBottomBar
                    rootStyles={{
                        marginHorizontal: Constant.normalMarginEdge,
                        backgroundColor: Constant.primaryColor,
                        marginTop: Constant.normalMarginEdge,
                        borderRadius: 4,
                    }}
                    dataList={this._getBottomItem()}/>
                <View style={{height: 2, opacity: 0.3}}/>
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
            </View>
        )
    }
}


export default SearchPage