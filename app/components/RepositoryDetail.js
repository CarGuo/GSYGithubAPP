/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, Dimensions, StyleSheet
} from 'react-native';
import {Actions, Tabs} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import repositoryActions from '../store/actions/repository'
import WebComponent from './widget/WebComponent'
import CommonBottomBar from './widget/CommonBottomBar'
import IssueListPage from './IssueListPage'
import RepositoryDetailActivity from './RepositoryDetailActivity'
import RepositoryDetailFile from './RepositoryDetailFile'
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';

/**
 * 详情
 */
class RepositoryDetail extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this._getBottomItem = this._getBottomItem.bind(this);
        this._refresh = this._refresh.bind(this);
        this.state = {
            dataDetail: this.props.defaultProps,
            dataDetailReadme: '',
            index: 0,
            showBottom: false,
            routes: [
                {key: '1', title: I18n('reposReadme')},
                {key: '2', title: I18n('reposActivity')},
                {key: '3', title: I18n('reposFile')},
                {key: '4', title: I18n('reposIssue')},
            ],
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
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
                        })
                    }
                });
            this._refresh();
        });
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {
    }

    _refresh() {
        repositoryActions.getRepositoryStatus(this.props.ownerName, this.props.repositoryName).then((res) => {
            if (res && res.result) {
                this.setState({
                    showBottom: true,
                    stared: res.data.star,
                    watched: res.data.watch,
                });
            }
        })
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
                return (
                    <WebComponent
                        source={{html: this.state.dataDetailReadme}}
                        userName={this.props.ownerName}
                        reposName={this.props.repositoryName}/>
                );
            case '2':
                return (
                    <RepositoryDetailActivity
                        dataDetail={this.state.dataDetail}
                        ownerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                );
            case '3':
                return (
                    <RepositoryDetailFile
                        ownerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                );
            case '4':
                return (
                    <IssueListPage
                        userName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                );
            default:
                return null;
        }
    };


    _getBottomItem() {
        let {stared, watched} = this.state;
        let {ownerName, repositoryName} = this.props;
        return [{
            itemName: stared ? I18n("reposUnStar") : I18n("reposStar"),
            icon: "star",
            iconColor: stared ? Constant.primaryColor : Constant.miWhite,
            itemClick: () => {
                Actions.LoadingModal({backExit: false});
                repositoryActions.doRepositoryStar(ownerName, repositoryName, !stared).then((res) => {
                    setTimeout(() => {
                        Actions.pop();
                        this._refresh();
                    }, 500);
                })
            }, itemStyle: {}
        }, {
            itemName: watched ? I18n("reposUnWatcher") : I18n("reposWatcher"),
            icon: "eye",
            iconColor: watched ? Constant.primaryColor : Constant.miWhite,
            itemClick: () => {
                Actions.LoadingModal({backExit: false});
                repositoryActions.doRepositoryWatch(ownerName, repositoryName, !watched).then((res) => {
                    setTimeout(() => {
                        Actions.pop();
                        this._refresh();
                    }, 500);
                })
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
                borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.lineColor
            }
        }, {
            itemName: I18n("reposRelease"),
            icon: 'tag',
            itemClick: () => {
                Actions.VersionPage({
                    ownerName: this.props.ownerName,
                    repositoryName: this.props.repositoryName,
                    title: this.props.ownerName + "/" + this.props.repositoryName
                })
            }, itemStyle: {}
        },]
    }

    render() {
        let bottom = this.state.showBottom ? <CommonBottomBar dataList={this._getBottomItem()}/> : <View/>
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <TabViewAnimated
                    style={{
                        flex: 1,
                    }}
                    lazy={true}
                    swipeEnabled={false}
                    navigationState={this.state}
                    renderScene={this._renderScene.bind(this)}
                    renderHeader={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={{
                        height: 0,
                        width: Dimensions.get('window').width,
                    }}
                />
                {bottom}
            </View>
        )
    }
}

RepositoryDetail.defaultProps = {
    dataDetail: {
        forks_count: "---",
        fork: false,
        open_issues_count: "---",
        size: 0,
        watchers_count: "---",
        subscribers_count: "---",
        description: '---',
        language: '---',
    }
};


export default RepositoryDetail