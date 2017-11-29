/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, Dimensions
} from 'react-native';
import {Actions, Tabs} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import repositoryActions from '../store/actions/repository'
import WebComponent from './widget/WebComponent'
import RepositoryDetailActivity from './RepositoryDetailActivity'
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';

/**
 * 详情
 */
class RepositoryDetail extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this.state = {
            dataDetail: this.props.defaultProps,
            dataDetailReadme: '',
            index: 0,
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
        });
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {
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
                        owerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                );
            case '3':
                return (
                    <View style={[{flex: 1}, {backgroundColor: Constant.primaryColor}]}/>
                );
            case '4':
                return (
                    <View style={[{flex: 1}, {backgroundColor: Constant.primaryColor}]}/>
                );
            default:
                return null;
        }
    };

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <TabViewAnimated
                    style={{
                        flex: 1,
                    }}
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
            </View>
        )
    }
}

RepositoryDetail.defaultProps ={
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