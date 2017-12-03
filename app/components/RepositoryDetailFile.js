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
import CommonRowItem from './widget/CommonRowItem'
import CodeFileItem from './widget/CodeFileItem'

/**
 * 详情
 */
class RepositoryDetailActivity extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._renderHeaderRow = this._renderHeaderRow.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this.state = {
            dataSource: [],
            headerList: [],
            path: this.props.props
        };
        this.dsHeader = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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

    _renderHeaderRow(rowData) {
        return (
            <TouchableOpacity
                onPress={() => {

                }}
                style={[{marginRight: Constant.normalMarginEdge,}]}>{title}
                <View
                    style={[styles.flexDirectionRow, styles.centerH, styles.shadowCard, {
                        padding: Constant.normalMarginEdge,
                        marginTop: Constant.normalMarginEdge,
                        borderRadius: 3,
                    }]}>
                    <Text style={[{flex: 1, marginLeft: Constant.normalMarginEdge}, ...textStyle]}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        if (rowData.type === 'file') {
            return (
                <CodeFileItem
                    itemIcon={"code"}
                    titleStyle={[styles.subSmallText, {fontSize: Constant.minTextSize}]}
                    needTitle={false}
                    itemText={rowData.name}
                    onClickFun={() => {
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
                    }}/>
            )
        }
    }

    /**
     * 刷新
     * */
    _refresh() {
        reposActions.getReposFileDir(this.props.ownerName, this.props.repositoryName, this.state.path).then((res) => {
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


            }
        )
    }

    /**
     * 加载更多
     * */
    _loadMore() {

    }

    render() {
        let headerList = this.dsHeader.cloneWithRows(this.state.headerList);
        let header =
            <ListView
                renderRow={(rowData, sectionID, rowID, highlightRow) =>
                    this._renderHeaderRow(rowData, sectionID, rowID, highlightRow)
                }
                horizontal={true}
                style={{flex: 1}}
                removeClippedSubviews={false}
                ref="listHeader"
                enableEmptySections
                initialListSize={10}
                pageSize={10}
                dataSource={headerList}
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
    path: PropTypes.string,
    ownerName: PropTypes.string,
    repositoryName: PropTypes.string,
};


RepositoryDetailActivity.defaultProps = {
    dataDetail: {},
    ownerName: '',
    repositoryName: '',
    path: '',
};


export default RepositoryDetailActivity