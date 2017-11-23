/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, TextInput, TouchableOpacity, Keyboard
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import repositoryActions from '../store/actions/repository'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import EventItem from './widget/EventItem'
import CommonRowItem from './widget/CommonRowItem'
import CustomSearchButton from './widget/CustomSearchButton'
import PullListView from './widget/PullLoadMoreListView'
import RepositoryItem from './widget/RepositoryItem'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Config from '../config/'


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
        this.searchText = "";
        this.page = 2;
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {

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
        repositoryActions.searchRepository(this.searchText, 'Java').then((res) => {
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
        });
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
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
        repositoryActions.searchRepository(this.searchText, 'Java', null, null, this.page).then((res) => {
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


export default SearchPage