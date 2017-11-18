import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    View, Text, ListView, RefreshControl, ActivityIndicator
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../../style"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import * as Config from '../../config/'

class PullLoadMoreListView extends Component {

    constructor(props) {
        super(props);
        this._renderFooter = this._renderFooter.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        //设置state
        this.state = {
            isRefresh: false,
            isRefreshing: false,
            showLoadMore: false,
            showRefresh: true,
        };
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }


    /**
     * 绘制load more footer
     * */
    _renderFooter() {

        let footer = (this.state.showLoadMore) ?
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator
                    color={Constant.primaryColor}
                    animating={true}
                    style={{height: 50}}
                    size="large"/>
                <Text style={{fontSize: 15, color: 'black'}}>
                    {I18n('loadMoreing')}
                </Text>
            </View> : <View/>;

        return (footer);
    }

    /**
     * 刷新
     * */
    _refresh() {
        if (this.state.isRefreshing) {
            return
        }
        this.setState({
            isRefreshing: true,
            showLoadMore: false,
            isRefresh: true,
        });
        let {eventAction} = this.props;
        this.props.refresh && this.props.refresh();
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        if (this.state.isRefreshing) {
            return
        }
        if (this.props.dataSource.length === 0) {
            return
        }
        this.setState({
            isRefreshing: true,
            showRefresh: false,
        });
        this.props.loadMore && this.props.loadMore();
    }

    render() {
        let dataList = this.ds.cloneWithRows(this.props.dataSource);
        return (
            <ListView
                {...this.props}
                style={{flex: 1}}
                removeClippedSubviews={false}
                ref="list"
                enableEmptySections
                initialListSize={this.props.pageSize}
                pageSize={this.props.pageSize}
                onEndReachedThreshold={50}
                refreshControl={
                    <RefreshControl
                        enable={this.state.showRefresh}
                        refreshing={this.state.isRefresh}
                        onRefresh={this._refresh}
                        tintColor={Constant.primaryColor}
                        title={I18n('refreshing')}
                        colors={[Constant.primaryColor, Constant.actionColor]}/>}
                onEndReached={this._loadMore}
                renderFooter={this._renderFooter}
                dataSource={dataList}
            />
        )
    }

    showRefreshState() {
        this.setState({
            isRefresh: true,
        });
    }

    refreshComplete(showLoadMore = false) {
        this.setState({
            isRefreshing: false,
            isRefresh: false,
            showLoadMore: showLoadMore,
        });
    }

    loadMoreComplete(showLoadMore = false) {
        this.setState({
            isRefreshing: false,
            showRefresh: true,
            showLoadMore: showLoadMore,
        });
    }

}

PullLoadMoreListView.propTypes = {
    pageSize: PropTypes.number,
    dataSource: PropTypes.any,
    refresh: PropTypes.func,
    loadMore: PropTypes.func,
};
PullLoadMoreListView.defaultProps = {
    pageSize: Config.PAGE_SIZE,
    dataSource: [],
};

export default PullLoadMoreListView;