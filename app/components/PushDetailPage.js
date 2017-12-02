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
import CodeFileItem from './widget/CodeFileItem'
import reposActions from '../store/actions/repository'
import PullListView from './widget/PullLoadMoreListView'
import PushDetailHeader from './widget/PushDetailHeader'
import * as Config from '../config/'

/**
 * Issue详情
 */
class PushDetailPage extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.page = 2;
        this.state = {
            dataSource: [],
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
        let nameSplit = rowData.filename.split("/");
        return (
            <CodeFileItem
                itemIcon={"code"}
                titleStyle={[styles.subSmallText, {fontSize: Constant.minTextSize}]}
                itemTextTitle={rowData.filename}
                itemText={nameSplit[nameSplit.length - 1]}
                onClickFun={() => {
                }}/>
        )
    }


    /**
     * 刷新
     * */
    _refresh() {
        let {sha} = this.props;
        reposActions.getReposCommitsInfo(this.props.userName, this.props.repositoryName, sha).then((res) => {
            let size = 0;
            if (res && res.result) {
                this.page = 2;
                this.setState({
                    pushDetail: res.data,
                    dataSource: res.data.files
                });
                size = res.data.length;
            }
            if (this.refs.pullList) {
                this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE));
            }
        });
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        /*let {sha} = this.props;
        reposActions.getReposCommitsInfo(this.props.userName, this.props.repositoryName, sha).then((res) => {
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
        });*/
    }


    render() {
        let {pushDetail} = this.state;
        let header = (pushDetail) ?
            <PushDetailHeader actionUser={pushDetail.committer.login}
                              actionUserPic={pushDetail.committer.avatar_url}
                              pushDes={"Push at " + pushDetail.commit.message}
                              pushTime={pushDetail.commit.committer.date}
                              editCount={pushDetail.files.length + ""}
                              addCount={pushDetail.stats.additions + ""}
                              deleteCount={pushDetail.stats.deletions + ""}/> : <View/>;
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
            </View>
        )
    }
}


PushDetailPage.propTypes = {
    repositoryName: PropTypes.string,
    userName: PropTypes.string,
};


PushDetailPage.defaultProps = {
    userName: '',
    repositoryName: '',
};

export default PushDetailPage