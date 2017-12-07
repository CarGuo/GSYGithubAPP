import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    View, Text, ListView, RefreshControl, ActivityIndicator, Platform, TouchableOpacity, ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles, {screenHeight, screenWidth} from "../../style"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import * as Config from '../../config'
import Icon from 'react-native-vector-icons/Ionicons'

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
            </View> : <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{fontSize: 15, color: 'black', margin: Constant.normalMarginEdge}}>
                    {this.props.dataSource.length > 0 ? I18n('loadMoreEnd') : " "}
                </Text>
            </View>;

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
        if (!this.state.showLoadMore) {
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
        let refreshProps = {
            style: [styles.centered],
            enable: (this.state.showRefresh && this.props.enableRefresh),
            refreshing: this.state.isRefresh,
            onRefresh: this._refresh,
            tintColor: Constant.primaryColor,
            title: I18n('refreshing'),
            colors: [Constant.primaryColor, Constant.primaryLightColor],
        };
        if ((!this.props.dataSource || this.props.dataSource.length === 0)) {
            if (!this.props.hasOwnProperty("renderHeader")) {
                if (Platform.OS === 'android') {
                    return (
                        <RefreshControl
                            {...refreshProps}
                            style={[styles.centered, styles.flex]}>
                            <TouchableOpacity style={[styles.centered, styles.absoluteFull]}
                                              onPress={() => {
                                                  this._refresh();
                                                  this.showRefreshState();
                                              }}>
                                <Icon name={'logo-octocat'} size={50} color={Constant.primaryColor}/>
                                <Text style={[styles.normalText]}>
                                    {I18n("listEmpty")}
                                </Text>
                            </TouchableOpacity>
                        </RefreshControl>);
                } else {
                    return (
                        <View style={[styles.centered, styles.flex]}>
                            <TouchableOpacity style={[styles.centered, styles.absoluteFull, {zIndex: -999}]}
                                              onPress={() => {
                                                  this._refresh();
                                                  this.showRefreshState();
                                              }}>
                                <Icon name={'logo-octocat'} size={50} color={Constant.primaryColor}/>
                                <Text style={[styles.normalText]}>
                                    {I18n("listEmpty")}
                                </Text>
                            </TouchableOpacity>
                            <ScrollView
                                style={{width: screenWidth, height: 10}}
                                refreshControl={
                                    <RefreshControl
                                        style={[styles.centered]}
                                        {...refreshProps}
                                    />
                                }>
                            </ScrollView>
                        </View>

                    );
                }
            }
        }
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
                        style={[styles.centered]}
                        {...refreshProps}/>}
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

    scrollToTop() {
        if (this.refs.list)
            this.refs.list.scrollTo({y: 0, animate: false});
    }

    refreshComplete(showLoadMore = false) {
        this.setState({
            isRefreshing: false,
            isRefresh: false,
            showLoadMore: showLoadMore,
        });
        this.scrollToTop();
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
    enableRefresh: PropTypes.bool,
};
PullLoadMoreListView.defaultProps = {
    pageSize: Config.PAGE_SIZE,
    dataSource: [],
    enableRefresh: true,
};

export default PullLoadMoreListView;