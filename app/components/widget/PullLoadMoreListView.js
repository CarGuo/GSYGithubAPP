import React, {
    useState, useRef, useImperativeHandle, forwardRef
} from 'react';
import PropTypes from 'prop-types';
import {
    View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, RefreshControl
} from 'react-native';
import styles, {screenHeight} from "../../style"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import * as Config from '../../config'

/**
 * 上下拉列表控件
 */

function PullLoadMoreListView(props, ref) {

    const [isRefresh, setRefresh] = useState(false);
    const [isRefreshing, setRefreshing] = useState(false);
    const [showLoadMore, setLoadMore] = useState(false);
    const [showRefresh, setShowRefresh] = useState(true);
    const [listHeight, setListHeight] = useState(0);
    const list = useRef(null);

    /**
     * 绘制load more footer
     * */
    function _renderFooter() {

        let footer = (showLoadMore) ?
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
                    {props.dataSource != null && props.dataSource.length > 0 ? I18n('loadMoreEnd') : " "}
                </Text>
            </View>;

        return footer;
    }

    /**
     * 刷新
     * */
    function _refresh() {
        if (isRefreshing) {
            return
        }
        setRefreshing(true)
        setLoadMore(false)
        setRefresh(true)
        props.refresh && props.refresh();
    }

    /**
     * 加载更多
     * */
    function _loadMore() {
        if (isRefreshing) {
            return
        }
        if (!showLoadMore) {
            return
        }
        if (props.dataSource.length === 0) {
            return
        }
        setRefreshing(true)
        setShowRefresh(false)
        props.loadMore && props.loadMore();
    }

    function scrollToTop() {
        if (props.dataSource <= 0) {
            return;
        }
        if (list)
            list.current.scrollToIndex({index: 0, animate: false});
    }
    let openMethods = {
        refreshComplete: (showLoadMore = false, _scrollToTop = false) => {
            setRefreshing(false)
            setRefresh(false)
            setLoadMore(showLoadMore)
            if (_scrollToTop)
                scrollToTop();
        },
        loadMoreComplete: (showLoadMore = false) => {
            setRefreshing(false)
            setShowRefresh(true)
            setLoadMore(showLoadMore)
        },
        showRefreshState: () => {
            setRefresh(true)
        },
        scrollToTop: () => {
            scrollToTop();
        }
    }
    useImperativeHandle(ref, () => ({
        refreshComplete: openMethods.refreshComplete,
        loadMoreComplete: openMethods.loadMoreComplete,
        showRefreshState: openMethods.showRefreshState,
        scrollToTop: openMethods.scrollToTop
    }));


    function _renderEmpty() {
        return (!props.hasOwnProperty("renderHeader")) ?
            <View style={[styles.centered, {
                flex: 1,
                height: listHeight
            }]}>
                <TouchableOpacity style={[styles.centered, {flex: 1}]}
                                  onPress={() => {
                                      _refresh();
                                      openMethods.showRefreshState();
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


    let refreshProps = {
        refreshing: isRefresh,
        onRefresh: _refresh,
        tintColor: Constant.primaryColor,
        title: I18n('refreshing'),
        colors: [Constant.primaryColor, Constant.primaryLightColor],
    };

    return (
        <FlatList
            style={{flex: 1}}
            ref={list}
            ListEmptyComponent={_renderEmpty()}
            //true的时候目前会在ios上，首页tab切换时导致空白
            removeClippedSubviews={false}
            {...refreshProps}
            onLayout={(e) => {
                if (listHeight === 0 && e.nativeEvent.layout.height !== 0) {
                    setListHeight(e.nativeEvent.layout.height)
                }
            }}
            renderItem={
                ({item, index}) => props.renderRow(item, index)
            }
            ListHeaderComponent={props.renderHeader}
            ItemSeparatorComponent={({highlighted}) => <View/>}
            enableEmptySections
            initialListSize={props.pageSize}
            pageSize={props.pageSize}
            initialNumToRender={Config.PAGE_SIZE}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={_loadMore}
            ListFooterComponent={_renderFooter}
            data={props.dataSource}
        />
    )
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

PullLoadMoreListView = forwardRef(PullLoadMoreListView);

export default PullLoadMoreListView