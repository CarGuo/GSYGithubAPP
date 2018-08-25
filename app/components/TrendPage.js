import React, {Component} from 'react';
import {
    View, Text, StatusBar, Platform, InteractionManager
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles, {screenWidth, navBarHeight} from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import reposAction from '../store/actions/repository'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getActionAndDes} from '../utils/eventUtils'
import RepositoryItem from './widget/RepositoryItem'
import PullListView from './widget/PullLoadMoreListView'
import * as Config from '../config'
import PickerItem from './widget/TrendPickerItem';
import {TrendTime, TrendType} from '../utils/filterUtils';
import {filterItemHeight, pickerViewStyle, pickerTextStyle, dropDownStyle, adjustFrame} from '../utils/filterUtils';

/**
 * 趋势数据列表
 */
class TrendPage extends Component {

    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._refreshData = this._refreshData.bind(this);
        this.timeLine = 'daily';
        this.languageType = null;

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._refreshData();
        })
    }

    componentWillUnmount() {
    }

    _refreshData() {
        if (this.refs.pullList)
            this.refs.pullList.showRefreshState();
        this._refresh();
    }

    _renderRow(rowData) {
        return (
            <RepositoryItem
                ownerName={rowData.name}
                ownerPic={rowData.contributors[0]}
                repositoryName={rowData.reposName}
                repositoryStar={rowData.starCount}
                repositoryFork={rowData.forkCount}
                repositoryWatch={rowData.meta}
                hideWatchIcon={true}
                repositoryType={rowData.language}
                repositoryDes={rowData.description}
            />
        )
    }

    /**
     * 刷新
     * */
    _refresh() {
        let {reposAction} = this.props;
        reposAction.getTrend(0, this.timeLine, this.languageType, () => {
            this.page = 2;
            setTimeout(() => {
                if (this.refs.pullList) {
                    this.refs.pullList.refreshComplete(false, true);
                }
            }, 500);
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        if (this.refs.pullList) {
            this.refs.pullList.loadMoreComplete(false);
        }
    }

    render() {
        let {reposState} = this.props;
        let dataSource = (reposState.trend_repos_data_list);
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <View style={[styles.shadowCard, styles.flexDirectionRowNotFlex, {
                    height: filterItemHeight,
                    backgroundColor: Constant.white,
                }]}>
                    <PickerItem
                        defaultValue={TrendTime[0].toString()}
                        defaultIndex={0}
                        adjustFrame={adjustFrame}
                        itemHeight={filterItemHeight}
                        style={pickerViewStyle}
                        textStyle={pickerTextStyle}
                        dropdownStyle={[...dropDownStyle,
                            {height: filterItemHeight * TrendTime.length}]}
                        options={TrendTime}
                        onSelect={(rowID, rowData) => {
                            this.timeLine = rowData.value;
                            this._refreshData();
                        }}
                    />
                    <PickerItem
                        defaultValue={TrendType[0].toString()}
                        defaultIndex={0}
                        adjustFrame={adjustFrame}
                        itemHeight={filterItemHeight}
                        style={pickerViewStyle}
                        textStyle={pickerTextStyle}
                        dropdownStyle={[...dropDownStyle,
                            {height: filterItemHeight * TrendType.length}]}
                        options={TrendType}
                        onSelect={(rowID, rowData) => {
                            this.languageType = rowData.value;
                            this._refreshData();
                        }}
                    />
                </View>
                <View style={{height: 2, opacity: 0.3}}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    renderRow={(rowData, index) =>
                        this._renderRow(rowData, index)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={dataSource}
                />
            </View>
        );
    }

}

export default connect(state => ({
    userState: state.user,
    loginState: state.login,
    reposState: state.repository,
}), dispatch => ({
    loginAction: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch),
    reposAction: bindActionCreators(reposAction, dispatch)
}))(TrendPage)
