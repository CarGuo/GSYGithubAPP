/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, Text, StatusBar, InteractionManager, TouchableOpacity, ListView
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions, Tabs} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import reposActions from '../store/actions/repository'
import PullListView from './widget/PullLoadMoreListView'
import CommonRowItem from './common/CommonRowItem'
import CodeFileItem from './widget/CodeFileItem'

/**
 * 详情
 */
class RepositoryDetailFilePage extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._renderHeaderRow = this._renderHeaderRow.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataSource: [],
            headerList: ["."],
            path: this.props.props
        };
        this.loading = false;
        this.curBranch = this.props.curBranch;
        this.dsHeader = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._refresh(this.state.path);
        })
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {
    }

    _renderHeaderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.loading) {
                        return
                    }
                    let {headerList} = this.state;
                    if (headerList[rowID] !== ".") {
                        let newHeaderList = headerList.slice(0, parseInt(rowID) + 1);
                        let path = newHeaderList.slice(1, newHeaderList.length).join("/");
                        this.setState({
                            path: path,
                            headerList: newHeaderList,
                        });
                        this._refresh(path)
                    } else {
                        let newHeaderList = ["."];
                        this.setState({
                            path: "",
                            headerList: newHeaderList,
                        });
                        this._refresh("")
                    }
                    this.loading = true;
                }}
                style={[{marginRight: Constant.normalMarginEdge,}]}>
                <View
                    style={[styles.flexDirectionRow, styles.centerH, {
                        paddingVertical: Constant.normalMarginEdge,
                        marginTop: Constant.normalMarginEdge,
                        borderRadius: 3,
                    }]}>
                    <Text style={[{flex: 1, marginRight: Constant.normalMarginEdge}]}>{rowData + " >"}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        if (rowData.type === 'file') {
            let {headerList} = this.state;
            return (
                <CodeFileItem
                    itemIcon={"code"}
                    titleStyle={[styles.subSmallText, {fontSize: Constant.minTextSize}]}
                    needTitle={false}
                    itemText={rowData.name}
                    onClickFun={() => {
                        Actions.CodeDetailPage({
                            path: headerList.slice(1, headerList.length).join("/") + "/" + rowData.name,
                            title: rowData.name,
                            ownerName: this.props.ownerName,
                            repositoryName: this.props.repositoryName,
                            branch: this.curBranch ? this.curBranch : 'master',
                            html_url: rowData.html_url
                        })
                    }}/>

            )
        } else {
            return (
                <CommonRowItem
                    bottomLine={false}
                    topLine={false}
                    viewStyle={[styles.shadowCard, {
                        padding: Constant.normalMarginEdge,
                        marginTop: Constant.normalMarginEdge,
                        borderRadius: 3,
                    }]}
                    textStyle={[{marginLeft: Constant.normalMarginEdge}]}
                    itemIcon={"file-directory"}
                    itemText={rowData.name}
                    onClickFun={() => {
                        if (this.loading) {
                            return
                        }
                        let {headerList} = this.state;
                        headerList.push(rowData.name);
                        this.setState({
                            headerList: headerList,
                        });
                        let path = headerList.slice(1, headerList.length).join("/");
                        this.setState({
                            path: path,
                        });
                        this._refresh(path);
                        this.loading = true;
                    }}/>
            )
        }
    }

    /**
     * 刷新
     * */
    _refresh(path) {
        if (this.refs.pullList)
            this.refs.pullList.showRefreshState();
        reposActions.getReposFileDir(this.props.ownerName, this.props.repositoryName, path, this.curBranch).then((res) => {
                if (res && res.result) {
                    let dir = [];
                    let file = [];
                    res.data.forEach((item) => {
                        if (item.type === 'file') {
                            file.push(item)
                        } else {
                            dir.push(item)
                        }
                    });
                    let data = dir.concat(file);
                    this.setState({
                        dataSource: data
                    })
                }
                setTimeout(() => {
                    if (this.refs.pullList) {
                        this.refs.pullList.refreshComplete(false);
                    }
                }, 500);
                this.loading = false;

            }
        )
    }


    /**
     * 加载更多
     * */
    _loadMore() {

    }

    changeBranch(branch) {
        this.curBranch = branch;
        let newHeaderList = ["."];
        this.setState({
            path: "",
            headerList: newHeaderList,
        });
        this._refresh("")
    }

    render() {
        let headerList = this.dsHeader.cloneWithRows(this.state.headerList);
        let header =
            <View style={[{height: 40, flex: 1, marginHorizontal: Constant.normalMarginEdge}]}>
                <ListView
                    renderRow={(rowData, sectionID, rowID, highlightRow) =>
                        this._renderHeaderRow(rowData, sectionID, rowID, highlightRow)
                    }
                    horizontal={true}
                    style={{height: 40, flex: 1}}
                    removeClippedSubviews={false}
                    ref="listHeader"
                    enableEmptySections
                    initialListSize={10}
                    pageSize={10}
                    dataSource={headerList}
                />
            </View>;
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

RepositoryDetailFilePage.propTypes = {
    path: PropTypes.string,
    ownerName: PropTypes.string,
    repositoryName: PropTypes.string,
};


RepositoryDetailFilePage.defaultProps = {
    dataDetail: {},
    ownerName: '',
    repositoryName: '',
    path: '',
};


export default RepositoryDetailFilePage