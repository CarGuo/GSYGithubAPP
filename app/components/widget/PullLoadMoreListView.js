import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image
} from 'react-native';
import styles, {screenHeight} from "../../style"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import * as Config from '../../config'

/**
 * 上下拉列表控件
 */
class PullLoadMoreListView extends Component {

    constructor(props) {
        super(props);
        this._renderFooter = this._renderFooter.bind(this);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._renderEmpty = this._renderEmpty.bind(this);
        //设置state
        this.state = {
            isRefresh: false,
            isRefreshing: false,
            showLoadMore: false,
            showRefresh: true,
            listHeight: 0,

        };
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

    _renderEmpty() {
        return (!this.props.hasOwnProperty("renderHeader")) ?
            <View style={[styles.centered, {
                flex: 1,
                height: this.state.listHeight
            }]}>
                <TouchableOpacity style={[styles.centered, {flex: 1}]}
                                  onPress={() => {
                                      this._refresh();
                                      this.showRefreshState();
                                  }}>
                    <Image source={require("../../img/logo.png")}
                           resizeMode={"contain"}
                           style={{width: 80, height: 80}}/>
                    <Text style={[styles.normalText]}>
                        {I18n("listEmpty")}
                    </Text>
                </TouchableOpacity>
            </View> : <View/>;
    }

    render() {
        let refreshProps = {
            refreshing: this.state.isRefresh,
            onRefresh: this._refresh,
            tintColor: Constant.primaryColor,
            title: I18n('refreshing'),
            colors: [Constant.primaryColor, Constant.primaryLightColor],
        };

        return (
            <FlatList
                style={{flex: 1}}
                ref="list"
                ListEmptyComponent={this._renderEmpty()}
                removeClippedSubviews={true}
                {...refreshProps}
                onLayout={e => this.setState({listHeight: e.nativeEvent.layout.height})}
                renderItem={
                    ({item, index}) => this.props.renderRow(item, index)
                }
                ListHeaderComponent={this.props.renderHeader}
                ItemSeparatorComponent={({highlighted}) => <View/>}
                enableEmptySections
                initialListSize={this.props.pageSize}
                pageSize={this.props.pageSize}
                initialNumToRender={Config.PAGE_SIZE}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={this._loadMore}
                ListFooterComponent={this._renderFooter}
                data={this.props.dataSource}
            />
        )
    }

    showRefreshState() {
        this.setState({
            isRefresh: true,
        });
    }

    scrollToTop() {
        if (this.props.dataSource <= 0) {
            return;
        }
        if (this.refs.list)
            this.refs.list.scrollToIndex({index: 0, animate: false});
    }

    refreshComplete(showLoadMore = false, scrollToTop = false) {
        this.setState({
            isRefreshing: false,
            isRefresh: false,
            showLoadMore: showLoadMore,
        });
        if (scrollToTop)
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