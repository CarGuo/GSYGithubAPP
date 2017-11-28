/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, Text, StatusBar, Dimensions, ScrollView, Keyboard
} from 'react-native';
import {Actions, Tabs} from 'react-native-router-flux';
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
import WebComponent from './widget/WebComponent'
import RepositoryHeader from './widget/RepositoryHeader'
import Icon from 'react-native-vector-icons/Ionicons'
import resolveTime from '../utils/timeUtil'
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';
import HTMLView from 'react-native-htmlview';
import Markdown from 'react-native-simple-markdown'
import address from "../net/address";
import {MarkdownView} from 'react-native-markdown-view'

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
};


/**
 * 详情
 */
class RepositoryDetail extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.page = 2;
        this.state = {
            dataDetail: {},
            dataDetailReadme: '',
            index: 0,
            routes: [
                {key: '1', title: 'First'},
                {key: '2', title: 'Second'},
                {key: '3', title: 'Third'},
                {key: '4', title: 'Fourth'},
            ],
        }
    }

    _handleIndexChange = index => this.setState({index});

    _renderHeader = props =>
        <TabBar {...props}
                style={{backgroundColor: Constant.primaryColor}}
                labelStyle={{color: Constant.white}}
                indicatorStyle={{backgroundColor: Constant.miWhite}}
        />;

    _renderScene = ({route}) => {
        switch (route.key) {
            case '1':
                let {
                    forks_count, fork, open_issues_count, size, watchers_count,
                    subscribers_count, description, language, created_at, pushed_at, parent
                } = this.state.dataDetail;
                return (
                    <RepositoryHeader
                        ownerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                        repositoryStar={watchers_count + ""}
                        repositoryFork={forks_count + ""}
                        repositoryWatch={subscribers_count + ""}
                        repositoryIssue={open_issues_count + ""}
                        repositorySize={(size / 1024).toFixed(2) + "M"}
                        repositoryType={language}
                        repositoryDes={description}
                        repositoryIsFork={fork}
                        repositoryParentName={parent ? parent.full_name : null}
                        created_at={resolveTime(created_at)}
                        push_at={resolveTime(pushed_at)}
                    />
                );
            case '2':
                return (
                        <WebComponent
                            source={{html: this.state.datahtml}}
                            startInLoadingState={true}/>
                );
            case '3':
                return (
                    <View style={[{flex: 1}, {backgroundColor: '#673ab7'}]}/>
                );
            case '4':
                return (
                    <View style={[{flex: 1}, {backgroundColor: '#673ab7'}]}/>
                );
            default:
                return null;
        }
    };

    componentDidMount() {
        repositoryActions.getRepositoryDetail(this.props.ownerName, this.props.repositoryName)
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        dataDetail: res.data
                    })
                }
            });

        repositoryActions.getRepositoryDetailReadme(this.props.ownerName, this.props.repositoryName)
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        dataDetailReadme: res.data,
                        datahtml: res.datahtml,
                    })
                }
            });
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {
    }


    _renderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <View/>
        )
    }

    /**
     * 刷新
     * */
    _refresh() {

    }

    /**
     * 加载更多
     * */
    _loadMore() {
    }


    render() {
        let {
            forks_count, fork, open_issues_count, size, watchers_count,
            subscribers_count, description, language, created_at, pushed_at, parent
        } = this.state.dataDetail;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <TabViewAnimated
                    style={{
                        flex: 1,
                    }}
                    navigationState={this.state}
                    renderScene={this._renderScene.bind(this)}
                    renderHeader={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={initialLayout}
                />
            </View>
        )
    }
}


export default RepositoryDetail